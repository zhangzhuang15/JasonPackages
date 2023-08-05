import { Socket, createServer, Server } from "node:net";
import { spawnSync } from "node:child_process";
import path from "node:path";

interface RequestData {
  type: "tagname" | "close";
  data: string;
}

// http server(koa or express?):
// 1. receive the request from puppeteer
// 2. capture screen shot

function getChromeWindowID(tagPageName: string): null | string {
  // delete the protocol of import.meta.url
  // file:///a/c/f/g  -> /a/c/f/g
  const { pathname } = new URL(import.meta.url);

  const { status, stdout } = spawnSync(
    `./GetWindowID "Google Chrome for Testing" "${tagPageName}"`,
    {
      cwd: path.resolve(pathname, "../deps/get_window_id")
    }
  );

  if (status === 0) {
    return stdout.toString();
  }

  return null;
}

function handleRequestData(req: RequestData, socket: Socket, server: Server) {
  const { type, data } = req;

  if (type === "close") {
    socket.end(() => server.close());
    return;
  }

  if (type === "tagname") {
    const chromeWindowID = getChromeWindowID(data);
    const response = JSON.stringify({ data: chromeWindowID || "" });
    socket.end(response);
  }
}

function launchIPCServer(): Server {
  const ipcServer = createServer({
    allowHalfOpen: true,
    keepAlive: true
  });

  ipcServer.on("connection", socket => {
    const cache: Buffer[] = [];

    socket.on("data", data => {
      cache.push(data);
    });

    socket.on("end", () => {
      const buffer = Buffer.concat(cache);
      const requestData: RequestData = JSON.parse(buffer.toString());
      handleRequestData(requestData, socket, ipcServer);
    });
  });

  ipcServer.listen("/tmp/walking-code-movie");

  return ipcServer;
}

function main() {
  const ipcServer = launchIPCServer();
  ipcServer.once("close", () => process.nextTick(() => process.exit(0)));
}

main();
