/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
const pcolor = require('picocolors');

class JasonZhangCheckImportPlugin {
  /**
   *
   * @param {import("webpack").Compiler} compiler
   */
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.afterCompile.tap(
      'JasonZhangCheckImportPlugin',
      /**
       *
       * @param {import("webpack").Compilation} compilation
       * @param {*} callback
       */
      (compilation, callback) => {
        const iter = compilation.getWarnings();

        if (iter) {
          let outputWarn = false;

          for (const item of iter) {
            const { name } = item;
            if (name === 'ModuleDependencyWarning') {
              const r = [];
              item.module.dependencies.forEach(dep => {
                // case "import { jack } from "A"",
                // we dont care case:
                //   import * as M from "A"
                //   M.jack
                if (dep.directImport) {
                  r.push([dep._locSL, dep._locSC]);
                }
              });
              const startLine = item.loc.start.line;
              const startColumn = item.loc.start.column;
              if (r.find(one => one[0] === startLine && one[1] === startColumn)) {
                // do nothing
              } else {
                // eslint-disable-next-line no-continue
                continue;
              }
              if (outputWarn === false) {
                const title = pcolor.red('JasonZhangCheckImportPlugin: CHECK your IMPORT statement!');
                const subTitle = pcolor.red('you might access undefined imported function or variable');
                console.log(title);
                console.log(subTitle);
                console.log('More Information:');
              }
              // which file has error
              const filePath = pcolor.green(item.module.resourceResolveData.relativePath);
              const errorPosition = pcolor.blue(
                `${item.loc.start.line}:${item.loc.start.column}`
                                + `-${item.loc.end.line}:${item.loc.end.column}`,
              );

              console.log(
                filePath,
                ' ',
                errorPosition,
              );
              // more details about import statement provided by webpack
              console.error(item.message);
              console.log();
              outputWarn = true;
              r.length = 0;
            }
          }
          if (outputWarn) {
            const tip = pcolor.red('Build Failed due to JasonZhangCheckImportPlugin');
            console.log(tip);
            process.exit(-1);
          }
        }
      },
    );
  }
}

module.exports = JasonZhangCheckImportPlugin;
