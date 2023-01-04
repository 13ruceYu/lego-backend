import { Context, Application } from 'egg';
import { appendFileSync } from 'fs';

export default (options: any, app: Application) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    console.log('options', options);
    console.log('default options', app.config.logger);
    const startTime = Date.now();
    const requestTime = new Date();
    await next();
    const ms = Date.now() - startTime;
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
    appendFileSync('./log.txt', logTime + '\n');
  };
};
