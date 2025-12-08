const http2 = require("http2");
const https = require("https");

// const client = http2.connect("https://www.iciba.com/word?w=banana");
// const res = client.request({
//   [http2.constants.HTTP2_HEADER_PATH]: "/word?w=banana",
//   [http2.constants.HTTP2_HEADER_METHOD]: "GET",
//   [http2.constants.HTTP2_HEADER_SCHEME]: "https",
//   [http2.constants.HTTP2_HEADER_AUTHORITY]: "www.iciba.com"
// });

https.get("https://www.iciba.com/word?w=banana", response => {
  let data = "";

  response.on("data", chunk => {
    data += chunk;
  });

  response.on("end", () => {
    console.log("HTTP GET result: ", data);
  });
});

// let result = "";

// res.on("data", chunk => {
//   result += String(chunk);
// });

// res.on("end", () => {
//   console.log("result: ", result);
//   res.close();
// });

// res.on("close", () => {
//   // client.close();
// });
