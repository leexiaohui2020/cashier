module.exports = app => {
  const { router, controller } = app

  router.post('/api/user/getCode', controller.api.user.getCode)
  router.post('/api/user/regist', controller.api.user.regist)
  router.post('/api/user/sendCodeByAccount', controller.api.user.sendCodeByAccount)
  router.post('/api/user/login', controller.api.user.login)
  router.post('/api/user/checkAuth', controller.api.user.checkAuth)

  router.post('/api/instance/getPack', controller.api.instance.getPack)
  router.post('/api/instance/create', controller.api.instance.create)
  router.post('/api/instance/lst', controller.api.instance.lst)
  router.post('/api/instance/dsp', controller.api.instance.dsp)
  router.post('/api/instance/setWeixin', controller.api.instance.setWeixin)
  router.post('/api/instance/setZhifubao', controller.api.instance.setZhifubao)
  router.post('/api/instance/changeEmail', controller.api.instance.changeEmail)
  router.post('/api/instance/changeCallbackUrl', controller.api.instance.changeCallbackUrl)
  router.post('/api/instance/start', controller.api.instance.start)
  router.post('/api/instance/pause', controller.api.instance.pause)

  router.post('/open-api/order/create', controller.openApi.order.create)

  // router.post('/callback/test2019', controller.instance.callback.Test2019)

  router.get('/image/:filename', controller.app.image)
  router.get('/*', controller.app.index)
}
