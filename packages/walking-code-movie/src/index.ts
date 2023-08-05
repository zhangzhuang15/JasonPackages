/**
 * how to capture image on MacOS ?
 * screencapture -x -Jselection -tpng -T0 -Rx,y,width,height
 * refer: https://github.com/bencevans/screenshot-desktop/blob/main/lib/darwin/index.js
 *
 */

import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync, fork } from "node:child_process";
import { log } from "node:console";

interface ScreenShotArea {
  /** x position */
  xPx: number;
  /** y position */
  yPx: number;
  /** area width */
  widthPx: number;
  /** area height */
  heightPx: number;
}

function createChromeInstance(): Promise<Browser> {
  return puppeteer.launch({
    // headless 为 true 时，程序启动后，不会打开一个浏览器
    headless: false,
    // 在禁止浏览器启动后打开默认的空白页后，设置此项，这样
    // 后边新建的页面才会照常展示
    waitForInitialPage: false,
    // 默认情况下，打开chrome浏览器，会打开一个空白页，设置
    // 该参数禁止这种行为
    args: ["--no-startup-window"]
  });
}

function createScreenShot(areaRectangle: ScreenShotArea, savedFile: string) {
  const { xPx, yPx, widthPx, heightPx } = areaRectangle;
  const child = spawnSync(
    `screencapture -x -Jselection -tpng -T0 -R${xPx},${yPx},${widthPx},${heightPx} ${savedFile}`
  );
  log("screencapture process exit status: ", child.status);
}

async function workFlow(chrome: Browser) {
  // 1. generate page
  const page = await chrome.newPage();

  const template = path.join(process.cwd(), "src", "index.html");
  const html = readFileSync(template, { encoding: "utf-8", flag: "r+" });
  await page.setContent(html);

  await page.evaluate(makeScreenShot => {
    const box = document.getElementsByClassName("box")[0];
    const rect = box.getBoundingClientRect();
    const screenXPx = rect.x + window.screenX;
    const screenYPx = rect.y + window.screenY;
    const widthPx = rect.width;
    const heightPx = rect.height;

    const screenShotArea: ScreenShotArea = {
      xPx: screenXPx,
      yPx: screenYPx,
      widthPx,
      heightPx
    };

    let r: undefined | ((value: string) => void);
    const promise = new Promise(resolve => {
      r = resolve;
    });

    let timeoutMs = 0;
    let screenShotId = 0;

    const message = "hello peter";
    for (let i = 0; i < message.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      setTimeout(() => {
        box.textContent += message[i];
        window.requestAnimationFrame(() => {
          screenShotId += 1;
          makeScreenShot(screenShotArea, `${screenShotId}.png`);

          if (i === message.length - 1) {
            r!("");
          }
        });
      }, timeoutMs);

      timeoutMs += 600;
    }
    return promise;
  }, createScreenShot);

  page.on("close", () => process.exit());
}

async function main() {
  const { pathname } = new URL(import.meta.url);
  const modulePath = path.resolve(pathname, "./server.js");

  const child = fork(modulePath, { stdio: "ignore", cwd: process.cwd() });
  child.unref();

  const chrome = await createChromeInstance();
  workFlow(chrome);
}

main();
