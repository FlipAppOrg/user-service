import initializeApp, { listenApp } from './src/app';
import AuthRouter from './src/routes/auth.route';
import UserRouter from './src/routes/users.route';
import { ValidateEnv } from './src/utils/validateEnv';
import { NODE_ENV, PORT } from './src/config';
import  express from 'express';
import serverless from "serverless-http";

ValidateEnv();
const env = NODE_ENV || 'development';
const port = PORT || 3000;
const app = express();

try {
  initializeApp(app, [AuthRouter, UserRouter,]); 
  listenApp(app, port, env);
} catch (e) {
  console.log(e);
}
module.exports.handler = serverless(app);