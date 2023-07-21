import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const lineNoise = require("../native/index.node");

export default lineNoise;
