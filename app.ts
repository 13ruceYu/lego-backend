import { Application, IBoot } from 'egg';
import assert from 'assert';
import { createConnection } from 'mongoose';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    const { url } = this.app.config.mongoose;
    assert(url, '[egg-mongoose] url is required on config');
    const db = createConnection(url);
    db.on('connected', () => {
      app.logger.info(`[egg-mongoose] ${url} connected successful`);
    });
    app.mongoose = db;
  }
  configWillLoad(): void {
    // config file have been read and merged, but not work
    // last chance to change config
    console.log('config', this.app.config.baseUrl);
    console.log('enable middleware', this.app.config.coreMiddleware);
    this.app.config.coreMiddleware.unshift('myLogger');
  }
}
