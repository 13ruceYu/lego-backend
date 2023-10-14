import { Context, EggAppConfig } from 'egg';
import { appendFileSync } from 'fs';

export default (options: EggAppConfig['myLogger']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = Date.now();
    const requestTime = new Date();
    await next();
    const ms = Date.now() - startTime;
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
    if (options.allowedMethod.includes(ctx.method)) {
      appendFileSync('./myLog.txt', logTime + '\n');
    }
  };
};
