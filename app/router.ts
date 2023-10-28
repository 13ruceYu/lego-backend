import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const logger = app.middleware.myLogger({
  //   allowedMethod: [ 'GET' ],
  // })

  router.prefix('/api');

  router.get('/', controller.home.index);

  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.getUserInfo);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.post('/users/sendVeriCode', controller.user.sendVeriCode);

  router.get('/users/passport/gitee', controller.user.oauth);
  router.get('/users/oauth/gitee/callback', controller.user.oauthByGitee);

  router.get('/users/passport/github', controller.user.oauthGithub);
  router.get('/users/oauth/github/callback', controller.user.oauthByGithub);

  router.post('/works', controller.work.createWork);
  router.get('/works', controller.work.myList);
  router.get('/works/:id', controller.work.myWork);
  router.patch('/works/:id', controller.work.update);
  router.delete('/works/:id', controller.work.delete);

  router.post('/works/publish/:id', controller.work.publishWork);
  router.post('/works/publish-template/:id', controller.work.publishTemplate);

  router.post('/utils/upload-img', controller.utils.uploadMultipleFiles);

  router.get('/pages/:idAndUuid', controller.utils.renderH5Page);

  router.post('/channel', controller.work.createChannel);
  router.get('/channel/getWorkChannel/:id', controller.work.getWorkChannel);
  router.patch('/channel/updateName/:id', controller.work.updateChannelName);
  router.delete('/channel/:id', controller.work.deleteChannel);

};
