import { Application, IBoot } from 'egg';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  configWillLoad(): void {
    // config file have been read and merged, but not work
    // last chance to change config
    console.log('config', this.app.config.baseUrl);
    console.log('enable middleware', this.app.config.coreMiddleware);
    this.app.config.coreMiddleware.unshift('myLogger');
  }
}
