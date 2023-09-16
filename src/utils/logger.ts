import { existsSync, mkdirSync } from 'fs';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

import { LOG_DIR } from '../config';

import WinstonCloudWatch from 'winston-cloudwatch';

let logTransports: winstonDaily[] = []


/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});
export {logger}