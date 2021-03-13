import app from "./app";
import * as serverless from "serverless-http";

module.exports.handler = serverless(app);
