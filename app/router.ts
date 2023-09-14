import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const logger = app.middleware.myLogger({
    allowedMethod: [ 'GET' ],
  })

  router.get('/', controller.home.index);
  router.get('/test/:id', controller.test.index)
  router.get('/dog', logger, controller.test.getDog)
};
