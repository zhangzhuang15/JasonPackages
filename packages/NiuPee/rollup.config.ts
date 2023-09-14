/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { log } from "console";

// 本页面的配置借鉴[vite项目](https://github.com/vitejs/vite/blob/main/packages/vite/rollup.config.ts)
//
// vite项目中很多配置，我光看代码还不是很明白，自己动手去配置，到rollup官网和rollup插件仓库README 查找后，才
// 明白为什么要这样配置。

// rollup plugins 并非按照自上向下的顺序执行，这取决于插件所注册的hooks，
// 具体可以看[Rollup插件官方介绍](https://rollupjs.org/plugin-development/#plugins-overview);
// 当两个插件注册的hook相同，且这个hook需要有顺序的执行，两个插件的顺序性一致（比如说双方的 order都是 "pre"）
// ，此时就要按照plugins中配置的顺序自上向下执行了。

function developmentRollupConfig() {
  return [
    defineConfig({
      input: "browser.ts",
      plugins: [
        // [node-resolve插件仓库](https://github.com/rollup/plugins/tree/master/packages/node-resolve)
        // 默认情况下，rollup不会将node_modules中用到的依赖打包到bundle，使用本插件就可以弥补这点；
        //
        // 对于一个依赖，它的package.json中会表明整个依赖的代码入口文件是什么(比如 exports main browser)，
        // browser: true 就是告诉rollup从依赖的package.json的browser字段读取代码入口点；
        //
        // 从中就能理解 package.json 的 exports main browser的含义了， 这些字段就是一种约定，
        // 并不是说package.json中写了，就能产生效果了，还需要有像rollup这样的module解析器读取
        // 字段，完成解析工作才可以，默认情况下，package.json 的解析器是 node；
        //
        // nodeResolve插件的 order 是 "post"，会在resolveId阶段执行，且是最后一个执行，
        // typescript插件会在 nodeResolve插件之前执行，但不会造成什么影响；
        nodeResolve({
          mainFields: ["browser", "exports", "main"]
        }),
        // [typescript插件仓库](https://github.com/rollup/plugins/tree/master/packages/typescript)
        typescript({
          tsconfig: "./tsconfig.json",
          // tsconfig.json没有将 rollup.config.ts  exclude, 是为了保证rollup.config.ts被
          // rollup读取成功，而进入到项目ts代码编译的环节时，rollup.config.ts不是项目逻辑的一部分，
          // 所以要exclude掉
          exclude: "./rollup.config.ts",
          // ES2020 中可以使用 `import()`特性
          module: "ES2020",
          sourceMap: true,
          // declaration 和 declarationDir不能写入 tsconfig.json，
          //
          // 根据不同的env和target，我们采用的代码生成行为不同，比如生成
          // 浏览器使用的bundle时，声明文件放置在./target/esm/types下，
          // 生成node使用的bundle时，声明文件放置在 ./target/node/types下，
          // 这表明declarationDir是一个变量，不能固定写入tsconfig.json里；
          //
          // 另外一旦在 tsconfig.json中设置 declaration: true，那么
          // vscode就会给出提示，要求你必须给出 declarationDir，正如
          // 上面分析所言，declarationDir 是不固定的， 因此 declaration
          // 也是不固定的，不能写入 tsconfig.json
          declaration: true,
          declarationDir: "./target/esm/types"
        }),
        // [commonjs插件仓库](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md);
        // 我们自己编写的ts代码，在typescript编译之后，会变成esm风格的代码，但是引入的依赖可能最初使用commonjs风格
        // 写的（这里说的是用该风格写的纯js代码，不包含nodejs的API），需要用该插件转化为esm。
        commonjs()
      ],
      treeshake: {
        moduleSideEffects: false,
        tryCatchDeoptimization: false
      },
      output: {
        dir: "./target",
        format: "esm",
        entryFileNames: "esm/[name].js",
        chunkFileNames: "esm/chunks/[name]-[hash:8].js",
        sourcemap: true
      }
    })
  ];
}

export default (commandLineArgs: any) => {
  const { env } = commandLineArgs;

  let configs: ReturnType<typeof developmentRollupConfig> = [];

  switch (env) {
    case "production":
      break;
    case "development":
      configs = developmentRollupConfig();
      log("running in development mode");
      break;

    default:
      log("command testing: ", commandLineArgs);
  }

  return configs;
};
