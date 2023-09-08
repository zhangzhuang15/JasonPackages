const http2 = require("http2");

const client = http2.connect("https://www.iciba.com/word?w=banana");
const res = client.request({
  [http2.constants.HTTP2_HEADER_PATH]: "/word?w=banana",
  [http2.constants.HTTP2_HEADER_METHOD]: "GET",
  [http2.constants.HTTP2_HEADER_SCHEME]: "https",
  [http2.constants.HTTP2_HEADER_AUTHORITY]: "www.iciba.com"
});

let result = "";

res.on("data", chunk => {
  result += String(chunk);
});

res.on("end", () => {
  console.log("result: ", result);
  res.close();
});

res.on("close", () => {
  // client.close();
});
