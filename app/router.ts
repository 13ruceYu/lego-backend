import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const jwt = app.middleware.jwt({
  //   secret: app.config.jwt.secret,
  // });
  // const dogLogger = app.middleware.dogLogger({ allowedMethod: [ 'GET' ] }, app);
  const jwtMiddleware = app.jwt as any;

  router.get('/', controller.home.index);
  router.get('/test', controller.test.index);
  // router.get('/test/:id', controller.test.index);
  // router.get('/dog', dogLogger, controller.test.getDog);
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', jwtMiddleware, controller.user.show);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/api/users/loginByPhoneNumber', controller.user.loginByCellphone);
  router.get('/api/users/passport/gitee', controller.user.oauth);
  router.get('/api/users/passport/gitee/callback', controller.user.oauthByGitee);
  router.post('/api/works', jwtMiddleware, controller.work.createWork);
};
