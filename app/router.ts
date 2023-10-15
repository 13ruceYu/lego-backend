import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const logger = app.middleware.myLogger({
  //   allowedMethod: [ 'GET' ],
  // })
  const jwt = app.middleware.jwt({ secret: app.config.jwt.secret });

  router.get('/', controller.home.index);

  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users/getUserInfo', jwt, controller.user.getUserInfo);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.post('/api/users/sendVeriCode', controller.user.sendVeriCode);

  router.get('/api/users/passport/gitee', controller.user.oauth);
  router.get('/api/users/oauth/gitee/callback', controller.user.oauthByGitee);

  router.get('/api/users/passport/github', controller.user.oauthGithub);
  router.get('/api/users/oauth/github/callback', controller.user.oauthByGithub);

  router.post('/api/works', jwt, controller.work.createWork);
  router.get('/api/works', jwt, controller.work.myList);
  router.patch('/api/works/:id', jwt, controller.work.update);
  router.delete('/api/works/:id', jwt, controller.work.delete);

  router.post('/api/works/publish/:id', jwt, controller.work.publishWork);
  router.post('/api/works/publish-template/:id', jwt, controller.work.publishTemplate);

  router.post('/api/utils/upload', controller.utils.uploadToOSS);
};
