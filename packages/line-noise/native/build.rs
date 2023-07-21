extern crate cc;
extern crate neon_build;

fn main() {
    // compile linenoise.c to dynamic library based on the platform
    // this is simpler than doing the same thing in Makefile

    // right now, only support linux and macOS

    #[cfg(target_os = "linux")]
    {
        cc::Build::new()
            .file("./linenoise/linenoise.c")
            .compile("linenoise");
    }

    #[cfg(target_os = "macos")]
    {
        // shared_flag doesn't work, a bug from cc crate.
        // actually, lineoise will be a static library.
        
        cc::Build::new()
            .file("./linenoise/linenoise.c")
            .shared_flag(true)
            .compile("linenoise");
    }

    #[cfg(target_os = "windows")]
    {
        use std::process;
        print!("linenoise not supports windows right now");
        process::exit(15);
    }

    neon_build::setup(); // must be called in build.rs

    // add project-specific build logic here...
}
