import { NextFunction, Request, Response } from 'express';
import { UserSvcException } from '../exceptions/httpException';
import { logger } from '../utils/logger';

export const ErrorMiddleware = (error: UserSvcException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    console.log('sdfsd')
    // next(error);
  }
};
