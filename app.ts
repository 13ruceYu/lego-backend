import { IBoot, Application } from 'egg'
import * as assert from 'assert'
import { createConnection } from 'mongoose';
import { join } from 'path';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app
    const { url } = this.app.config.mongoose
    assert(url, '[mongoose] url is required in config')
    const db = createConnection(url)
    db.on('connected', () => {
      app.logger.info(`[mongoose] ${url} connected successfully`)
    })
    app.mongoose = db
  }
  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    this.app.config.coreMiddleware.unshift('myLogger')
  }
  async willReady() {
    const { app } = this
    const dir = join(app.config.baseDir, 'app/model')
    app.loader.loadToApp(dir, 'model', { caseStyle: 'upper' })
    // app/model/user.ts => app.model.User
  }
}
