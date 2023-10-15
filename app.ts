import { IBoot, Application } from 'egg';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    this.app.config.coreMiddleware.unshift('myLogger');
    this.app.config.coreMiddleware.push('customError');
  }
  async didReady() {
    console.log('middleware---', this.app.middleware);
  }
}
