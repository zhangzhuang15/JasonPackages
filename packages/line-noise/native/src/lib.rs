use lazy_static::lazy_static;
use libc::{c_char, c_int, c_void, size_t};
use neon::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json;
use std::{
    collections::HashMap,
    ffi::{CStr, CString},
    io::BufReader,
    sync::Mutex,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub pattern: String,
    pub tips: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HintConfig {
    pub pattern: String,
    /// 提示词的颜色
    pub color: c_int,
    /// 提示词的字重
    pub bold: c_int,
    /// 提示词
    pub hint: String,
}

#[repr(C)]
struct LineNoiseCompletions {
    len: size_t,
    cvec: *mut *mut c_char,
}

type LineNoiseCompletionCallback =
    extern "C" fn(buf: *const c_char, completion: *mut LineNoiseCompletions);

type LineNoiseHintsCallback =
    extern "C" fn(buf: *const c_char, color: *mut c_int, bold: *mut c_int) -> *mut c_char;

#[link(name = "linenoise", kind = "static")]
extern "C" {

    fn linenoise(prompt: *const c_char) -> *mut c_char;

    // just convert ptr to rust String, rust helps us 
    // manage the lifetime, so we don't have to invoke
    // this function to release memory.
    fn linenoiseFree(ptr: *mut c_void) -> c_void;

    fn linenoiseHistoryAdd(line: *const c_char) -> c_int;
    fn linenoiseHistorySetMaxLen(len: c_int) -> c_int;
    fn linenoiseHistorySave(filename: *const c_char) -> c_int;
    fn linenoiseHistoryLoad(filename: *const c_char) -> c_int;

    fn linenoiseMaskModeEnable() -> c_void;
    fn linenoiseMaskModeDisable() -> c_void;

    fn linenoiseSetCompletionCallback(completionFunction: LineNoiseCompletionCallback) -> c_void;
    fn linenoiseAddCompletion(
        completions: *mut LineNoiseCompletions,
        completion_tip: *const c_char,
    ) -> c_void;

    fn linenoiseSetHintsCallback(hints: LineNoiseHintsCallback) -> c_void;
    fn linenoiseSetFreeHintsCallback(hints: LineNoiseHintsCallback) -> c_void;

    fn linenoiseClearScreen() -> c_void;

    fn linenoisePrintKeyCodes() -> c_void;

    fn linenoiseSetMultiLine(arg: c_int) -> c_void;
}

lazy_static! {
    static ref COMPLETION_MAP: Mutex<HashMap<String, Vec<String>>> = Mutex::new(HashMap::new());
    static ref HINT_MAP: Mutex<HashMap<String, HintConfig>> = Mutex::new(HashMap::new());
}

/// print prompt into the terminal, then wait for people's input and return it.
///
/// ## Example
///
/// if you `prompt("Jack")`, then the terminal will be like:
///
/// `Jack> `
///
/// then you input "hello world" and press Enter key,
/// terminal will be like:
///
/// `Jack>hello world`
///
/// finally this function will return "hello world" to you.
fn prompt(mut cx: FunctionContext) -> JsResult<JsString> {
    let mut prompt = String::from("");

    if cx.len() > 0 {
        let arg: Handle<JsString> = cx.argument(0).unwrap();
        prompt = arg.value();
    }

    let mut rust_string: String = String::from("");

    unsafe {
        let c_prompt = CString::new(prompt).unwrap();
        let user_input = linenoise(c_prompt.as_ptr());

        // for many experiments, there's conclusion:
        // yes: use CStr transform *mut i8 to String
        // no:  use String::from_raw_parts do same thing

        rust_string = CStr::from_ptr(user_input).to_string_lossy().into_owned();

        // only if you run cargo build in develop mode, you could see these following output,
        // when you run cargo build --release in build mode, you won't see

        #[cfg(debug_assertions)]
        println!("[Rust side debug message]rust_string: {rust_string}");
    };

    Ok(cx.string(rust_string))
}

/// transform your input to `*`, so that mask it.
///
/// ## Example
/// before you mask your input, your terminal looks like:
///
/// `Jack> hello`
///
/// after you mask your input, there's a change:
///
/// `Jack> *****`
fn mask_your_input(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    unsafe {
        linenoiseMaskModeEnable();
    }
    Ok(cx.boolean(true))
}

/// transform your masked input to original input.
///
/// ## Example
/// you have masked your input `hello` , your terminal looks like:
///
/// `Jack> *****`
///
/// after you unmask your input, there's a change:
///
/// `Jack> hello`
fn unmask_your_input(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    unsafe {
        linenoiseMaskModeDisable();
    }

    Ok(cx.boolean(true))
}

/// 传给下层 C library 注册命令补全的接口
extern "C" fn based_completion_callback(buf: *const c_char, completion: *mut LineNoiseCompletions) {
    let map = COMPLETION_MAP.lock().unwrap();
    if map.is_empty() {
        println!("WARN: you might forget to load completion.config.json");
    }

    let buf = unsafe { CStr::from_ptr(buf) };
    let buf = buf.to_str().unwrap();

    // look up hash_map, insert tips into completion

    if map.contains_key(buf) {
        let completions = map.get(buf).unwrap();

        completions.into_iter().for_each(|v| unsafe {
            let value = CString::new(v.as_str()).unwrap();
            let value = value.as_ptr();
            linenoiseAddCompletion(completion, value);
        });
    }
}

/// 自动下载命令自动补全逻辑的配置文件，向下层 C library 注册
fn load_completion_config(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    // 1. read the config file `completions.config.json`
    let file = std::fs::File::open("./completion.config.json");

    if file.is_err() {
        println!("WARN: cannot find completion.config.json!");
        return Ok(cx.boolean(false));
    }

    let file = file.unwrap();
    let reader = BufReader::new(file);

    // 2. turn to Vec<Config>
    let json: Vec<Config> = serde_json::from_reader(reader).unwrap();

    let mut map = COMPLETION_MAP.lock().unwrap();
    // 3. save the matched key-value in hash_map
    json.into_iter().for_each(|v| {
        map.insert(v.pattern, v.tips);
    });

    unsafe {
        linenoiseSetCompletionCallback(based_completion_callback);
    }

    Ok(cx.boolean(true))
}

/// 自动下载命令提示逻辑的配置文件，向下层 C library 注册
fn load_hint_config(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    // 1. read the config file `hint.config.json`
    let file = std::fs::File::open("./hint.config.json");

    if file.is_err() {
        println!("WARN: cannot find hint.config.json!");
        return Ok(cx.boolean(false));
    }

    let file = file.unwrap();
    let reader = BufReader::new(file);

    // 2. turn to Vec<HintConfig>
    let json: Vec<HintConfig> = serde_json::from_reader(reader).unwrap();

    let mut map = HINT_MAP.lock().unwrap();

    // 3. save the matched key-value in hash_map
    json.into_iter().for_each(|v| {
        map.insert(v.pattern.clone(), v);
    });

    unsafe {
        linenoiseSetHintsCallback(based_hint_callback);
    }

    Ok(cx.boolean(true))
}

/// 向下层 C library 注册命令提示接口
extern "C" fn based_hint_callback(
    buf: *const c_char,
    color: *mut c_int,
    bold: *mut c_int,
) -> *mut c_char {
    let mut map = HINT_MAP.lock().unwrap();

    let buf = unsafe { CStr::from_ptr(buf).to_string_lossy().into_owned() };

    if map.contains_key(&buf) {
        let config = map.get_mut(&buf).unwrap();

        unsafe {
            *color = config.color;
            *bold = config.bold;
        }

        return config.hint.as_mut_ptr().cast::<c_char>();
    }

    std::ptr::null_mut::<c_char>()
}

/// 撤销命令提示
fn cancel_hint_config(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    unsafe {
        linenoiseSetFreeHintsCallback(based_hint_callback);
    }

    Ok(cx.boolean(true))
}

fn register_completion_callback(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    // in original thought, we define completion callback function on
    // js side.
    //
    // we take out it from cx.argument::<JsFunction>(0).unwrap(), then we
    // transform buf(which is sent from c library) to JsString, give it to
    // our callback, get the result of completions, then register these
    // completions in c library.
    //
    // for example, our callback looks like:
    // ```js
    // function complete(value) {
    //    if (value === 'h') {
    //       return ["help", "hello"];
    //    }
    //    return [];
    // }
    // ```
    //
    // buf = {'h'}
    // so, we input buf to complete function, get the completions ["help", "hello"]
    // then  linenoiseAddCompletion register "help" "hello"
    //
    // finally, in your terminal, if you press 'h', then press TAB key,
    // you will see 'h' become "help", press TAB key again, you will see
    // "help" become "hello".
    //
    // But this thought cannot be implemented in Rust.
    // In order to transform *const c_char to JsString, we have to use cx.
    // So based_completion_callback_closure captures cx, and its function
    // pointer is in 128-bit size.
    // Unfortunately, function of c library is in 64-bit-size, so we cannot
    // transform this closure to extern "C" function, as a result, we fail
    // to register callback by linenoiseSetCompletionCallback.
    //
    // I take some other ways, for example, save cx in global variable,
    // in based_completion_callback_closure, I use this global variable
    // instead of cx.
    // In compile time, it works, this closure is in 64-bit size.
    // In runtime, it doesn't work, there will be `bus error` of C.
    //
    // I don't know how to solve this problem.
    // If you read this comment, and you're interested, welcome to make PR!

    let based_completion_callback_closure =
        |buf: *const c_char, completion: *mut LineNoiseCompletions| unsafe {
            // let mut cx = std::mem::replace(&mut g_cx, None).unwrap();
            // arg is callback function defined on js end,
            // its sign looks like `function(input: string): string[]`
            let arg: Handle<JsFunction> = cx.argument(0).unwrap();

            // transform the data produced by c library to JsString
            let input = CStr::from_ptr(buf).to_string_lossy().into_owned();
            let input: Handle<JsString> = cx.string(input);

            // send input JsString to js function defined by user on js end,
            // save the result in completions, which is string[] type from the
            // perspective of js end.
            let completions: Handle<JsArray> =
                arg.call_with(&mut cx).arg(input).apply(&mut cx).unwrap();

            // walk completions, register the completion by calling c library
            completions
                .to_vec(&mut cx)
                .unwrap()
                .into_iter()
                .for_each(|v| {
                    let value = v.downcast::<JsString>().unwrap();
                    let value = value.value();
                    let c_value = CString::new(value).unwrap();
                    linenoiseAddCompletion(completion, c_value.as_ptr());
                });
        };

    // AI helps me finish this part!
    let based_completion_callback: LineNoiseCompletionCallback =
        unsafe { std::mem::transmute(&based_completion_callback_closure) };

    unsafe {
        linenoiseSetCompletionCallback(based_completion_callback);
    }

    Ok(cx.boolean(true))
}

/// 加载command history file
fn load_history_from_file(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    if cx.len() == 0 {
        println!("ERROR: you don't tell me history file path");
        return Ok(cx.boolean(false))
    }

    let history_file_path = cx.argument::<JsString>(0).unwrap();
    let history_file_path = CString::new(history_file_path.value()).unwrap();
    let history_file_path = history_file_path.as_c_str().as_ptr();

    unsafe {
        linenoiseHistoryLoad(history_file_path);
    }

    Ok(cx.boolean(true))
}

/// 保存command history到磁盘
fn save_history_into_file(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    if cx.len() == 0 {
        println!("ERROR: you don't tell me which file to save your command history");
        return Ok(cx.boolean(false));
    }


    let history_file_path = cx.argument::<JsString>(0).unwrap();
    let history_file_path = CString::new(history_file_path.value()).unwrap();
    let history_file_path = history_file_path.as_c_str().as_ptr();

    unsafe {
        linenoiseHistorySave(history_file_path);
    }

    Ok(cx.boolean(true))
}

/// 将command添加进history
fn remember_command(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    if cx.len() == 0 {
        println!("ERROR: you don't tell me which command you want to save");
        return Ok(cx.boolean(false));
    }

    let command = cx.argument::<JsString>(0).unwrap();
    let command = CString::new(command.value()).unwrap();
    let command = command.as_c_str().as_ptr();

    unsafe {
        linenoiseHistoryAdd(command);
    }

    Ok(cx.boolean(true))
}

/// 设置command history 最多存储几条记录
fn limit_history_length(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    if cx.len() == 0 {
        println!("ERROR: you don't tell me how many commands history will save absolutely");
        return Ok(cx.boolean(false));
    }

    let size = cx.argument::<JsNumber>(0).unwrap();
    let size = size.value() as c_int;

    unsafe {
        
        linenoiseHistorySetMaxLen(size);
    }

    Ok(cx.boolean(true))
}

/// 设置多行模式
fn set_multiline_mode(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let mut open: i32 = 0;

    if cx.len() == 0 {
        println!("WARN: this will open multiline mode default");
        open = 1;
    } else {
        let arg = cx.argument::<JsNumber>(0).unwrap();
        let arg = arg.value() as i32;
        open = arg;
    }

    if open > 1 {
        open = 1;
    }

    unsafe {
        linenoiseSetMultiLine(open);
    }

    Ok(cx.boolean(true))
}

/// 进入特定交互界面，在界面中按下任意键，可以获得键值
fn enter_keycodes_interactive(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    unsafe {
        linenoisePrintKeyCodes();
    }

    Ok(cx.boolean(true))
}

/// 清空终端界面
fn clear_your_terminal_screen(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    unsafe {
        linenoiseClearScreen();
    }

    Ok(cx.boolean(true))
}

register_module!(mut cx, {
    cx.export_function("prompt", prompt);
    cx.export_function("loadCompletionConfig", load_completion_config);
    cx.export_function("loadHintConfig", load_hint_config);
    cx.export_function("maskYourInput", mask_your_input);
    cx.export_function("unmaskYourInput", unmask_your_input);
    cx.export_function("clearTerminalScreen", clear_your_terminal_screen);
    cx.export_function("cancelHint", cancel_hint_config);
    cx.export_function("enterKeycodesPlayground", enter_keycodes_interactive);
    cx.export_function("openMultilineMode", set_multiline_mode);
    cx.export_function("saveCommandHistoryIntoFile", save_history_into_file);
    cx.export_function("loadCommandHistoryFromFile", load_history_from_file);
    cx.export_function("setHistoryCapacity", limit_history_length);
    cx.export_function("rememberCommand", remember_command)
});

#[cfg(test)]
mod serde_test {
    use super::Config;
    use serde_json;

    #[test]
    fn deserialize_demo() {
        let result = std::fs::read("./completion.config.json").unwrap();
        let result: Vec<Config> = serde_json::from_slice(result.as_slice()).unwrap();

        assert_eq!(result[0].pattern, "h");
        assert_eq!(result[0].tips, vec!["help", "hello"]);
    }
}
