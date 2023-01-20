import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.middleware.jwt({
    secret: app.config.jwt.secret,
  });
  // const dogLogger = app.middleware.dogLogger({ allowedMethod: [ 'GET' ] }, app);

  router.get('/', controller.home.index);
  router.get('/test', controller.test.index);
  // router.get('/test/:id', controller.test.index);
  // router.get('/dog', dogLogger, controller.test.getDog);
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/:id', jwt, controller.user.show);
  router.post('/api/users/login', controller.user.loginByEmail);
};
