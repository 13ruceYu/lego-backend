import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const logger = app.middleware.myLogger({
  //   allowedMethod: [ 'GET' ],
  // })

  router.get('/', controller.home.index);

  router.post('/api/users/create', controller.user.createByEmail)
  router.get('/api/users/:id', controller.user.show)
  router.post('/api/users/login', controller.user.loginByEmail)
};
