import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const logger = app.middleware.myLogger({
  //   allowedMethod: [ 'GET' ],
  // })
  const jwt = app.middleware.jwt({ secret: app.config.jwt.secret });

  router.prefix('/api');

  router.get('/', controller.home.index);

  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', jwt, controller.user.getUserInfo);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.post('/users/sendVeriCode', controller.user.sendVeriCode);

  router.get('/users/passport/gitee', controller.user.oauth);
  router.get('/users/oauth/gitee/callback', controller.user.oauthByGitee);

  router.get('/users/passport/github', controller.user.oauthGithub);
  router.get('/users/oauth/github/callback', controller.user.oauthByGithub);

  router.post('/works', jwt, controller.work.createWork);
  router.get('/works', jwt, controller.work.myList);
  router.patch('/works/:id', jwt, controller.work.update);
  router.delete('/works/:id', jwt, controller.work.delete);

  router.post('/works/publish/:id', jwt, controller.work.publishWork);
  router.post('/works/publish-template/:id', jwt, controller.work.publishTemplate);

  router.post('/utils/upload-img', controller.utils.uploadMultipleFiles);
};
