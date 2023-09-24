import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const logger = app.middleware.myLogger({
  //   allowedMethod: [ 'GET' ],
  // })
  const jwt = app.middleware.jwt({ secret: app.config.jwt.secret })

  router.get('/', controller.home.index);

  router.post('/api/users/create', controller.user.createByEmail)
  router.get('/api/users/getUserInfo', jwt, controller.user.getUserInfo)
  router.post('/api/users/loginByEmail', controller.user.loginByEmail)
  router.post('/api/users/sendVeriCode', controller.user.sendVeriCode)
};
