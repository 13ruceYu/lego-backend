import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // const jwt = app.middleware.jwt({
  //   secret: app.config.jwt.secret,
  // });
  // const dogLogger = app.middleware.dogLogger({ allowedMethod: [ 'GET' ] }, app);
  router.prefix('/api');

  router.get('/ping', controller.home.index);
  router.get('/test', controller.test.index);
  // router.get('/test/:id', controller.test.index);
  // router.get('/dog', dogLogger, controller.test.getDog);
  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.show);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/users/loginByPhoneNumber', controller.user.loginByCellphone);
  router.get('/users/passport/gitee', controller.user.oauth);
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee);

  router.post('/works', controller.work.createWork);
  router.get('/works', controller.work.myList);
  router.get('/templates', controller.work.templateList);
  router.patch('/works/:id', controller.work.update);
  router.delete('/works/:id', controller.work.delete);
  router.post('/works/publish/:id', controller.work.publishWork);
  router.post('/works/publish-template/:id', controller.work.publishTemplate);

  router.post('/utils/upload-img', controller.utils.uploadMultipleFiles);
  router.get('/pages/:idAndUuid', controller.utils.renderH5Page);

  router.post('/channel', controller.work.createChannel);
  router.get('/channel/getWorkChannels/:id', controller.work.getWorkChannel);
  router.post('/channel/updateName/:id', controller.work.updateChannelName);
  router.delete('/channel/:id', controller.work.deleteChannel);

};
