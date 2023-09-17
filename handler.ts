import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './src/app';


const handler = serverless(app);

export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await handler(event);
};