import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const dogLogger = app.middleware.dogLogger({ allowedMethod: [ 'GET' ] }, app);

  router.get('/', controller.home.index);
  router.get('/test', controller.test.index);
  router.get('/test/:id', controller.test.index);
  router.get('/dog', dogLogger, controller.test.getDog);
};
