import initializeApp, { listenApp } from './app';
import AuthRouter from './routes/auth.route';
import UserRouter from './routes/users.route';
import { ValidateEnv } from './utils/validateEnv';
import { NODE_ENV, PORT } from './config';
import  express from 'express';
import serverless from "serverless-http";

ValidateEnv();
const env = NODE_ENV || 'development';
const port = PORT || 3000;
const app = express();

try {
  initializeApp(app, [AuthRouter, UserRouter,]);
  module.exports.handler = serverless(app);
  listenApp(app, port, env);
} catch (e) {
  console.log(e);
}
