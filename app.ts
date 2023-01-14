import { IBoot } from 'egg';
// import { join } from 'path';

export default class AppBoot implements IBoot {
  // private readonly app: Application;
  // constructor(app: Application) {
  //   this.app = app;
  // }
  configWillLoad(): void {
    // config file have been read and merged, but not work
    // last chance to change config
    // this.app.config.coreMiddleware.unshift('myLogger');
  }
  // async willReady(): Promise<void> {
  //   const dir = join(this.app.config.baseDir, 'app/model');
  //   this.app.loader.loadToApp(dir, 'model', {
  //     caseStyle: 'upper',
  //   });
  // }
}
