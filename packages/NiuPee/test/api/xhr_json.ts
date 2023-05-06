import BrowserRequestManager from "../../browser";

BrowserRequestManager.get("http://hello.com:8888/json")
  .readyForHeaders()
  .requestHeaders({
    "Content-Type": "application/json"
  })
  .xhrFire(null)
  .siu()
  .then(response => response.result)
  .then(response => response.data.isJson)
  .then(data => {});
