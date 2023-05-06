/* eslint-disable no-undef */

const port = 8888;
const hostname = "hello.com";

const mp3Button = document.getElementById("mp3");
const mp4Button = document.getElementById("mp4");
const jpgButton = document.getElementById("jpg");
const jsonButton = document.getElementById("json");
const docxButton = document.getElementById("docx");

mp3Button.addEventListener("click", () => {});

mp4Button.addEventListener("click", () => {});

jpgButton.addEventListener("click", () => {});

jsonButton.addEventListener("click", () => {
  BrowserRequestManager.get(`http://${hostname}:${port}/json`)
    .readyForHeaders()
    .requestHeaders({
      "Content-Type": "application/json"
    })
    .xhrFire(null)
    .siu()
    .then(response => response.result)
    .then(response => response.data.isJson)
    .then(data => {
      window.prompt("json data: ", data);
    });
});

docxButton.addEventListener("click", () => {});
