import { Application } from 'egg';
import { IBoot } from 'egg';
// import { join } from 'path';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  configWillLoad(): void {
    // config file have been read and merged, but not work
    // last chance to change config
    // this.app.config.coreMiddleware.unshift('myLogger');
    // 在此添加 customError 中间件，从而提前执行顺序
    this.app.config.coreMiddleware.push('customError');
  }
  // async willReady(): Promise<void> {
  //   console.log('---middleware---', this.app.config.coreMiddleware);
  // }
  async didReady(): Promise<void> {
    console.log('---middleware---', this.app.middleware);
  }
}
