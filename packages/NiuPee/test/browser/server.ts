import { createServer } from "http";
import { log } from "console";
import { readFile } from "fs";

function startServer() {
  // http://[hostname]:[port][pathname]?[query]#[hash]
  const port = 8888;
  const hostname = "hello.com";
  const server = createServer();

  server.once("listening", () => {
    log("server is running, listening at ", port);
  });

  server.on("request", (req, res) => {
    // req -> receive messages from http client;
    // res -> send messages to http client;

    const writeBackFile = (file: string) => {
      res.writeHead(200);
      res.on("drain", () => {
        res.end();
      });
      readFile(file, (error, data) => {
        if (error) {
          res.writeHead(500);
          res.end();
          return;
        }
        res.write(data);
        res.end();
      });
    };

    const contentType = req.headers["content-type"];
    log("req: ", req.headers);
    log("contentType: ", contentType);
    const { url } = req;

    // for-root request
    if (url === "/") {
      writeBackFile("./index.html");
      return;
    }

    if (url === "/index.js") {
      writeBackFile("./index.js");
      return;
    }

    if (url.includes("browser.js")) {
      writeBackFile("../../target/esm/browser.js");
      res.writeHead(200, "ok", { "Content-Type": "text/javascript" });
      return;
    }

    // for-jpg request
    if (contentType.indexOf("jpg") > -1) {
      writeBackFile("./static/example.jpg");
      return;
    }

    // for-mp3 request
    if (contentType.indexOf("mp3") > -1) {
      writeBackFile("./static/example.mp3");
      return;
    }

    // for-mp4 request
    if (contentType.indexOf("mp4") > -1) {
      writeBackFile("./static/example.mp4");
      return;
    }

    // for-docx request
    if (contentType.indexOf("document") > -1) {
      writeBackFile("./static/example.docx");
      return;
    }

    // for-json request
    if (contentType.indexOf("json") > -1) {
      res.writeHead(200, "ok", {
        "Content-Type": "application/json"
      });
      res.write(JSON.stringify({ msg: "hello", to: "my friend" }));
      res.end();
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(port, hostname);
}

startServer();
