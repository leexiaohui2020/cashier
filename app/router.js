module.exports = app => {
  const { router, controller } = app

  router.post('/api/user/getCode', controller.api.user.getCode)
  router.post('/api/user/regist', controller.api.user.regist)
  router.post('/api/user/sendCodeByAccount', controller.api.user.sendCodeByAccount)
  router.post('/api/user/login', controller.api.user.login)

  router.post('/api/instance/getPack', controller.api.instance.getPack)
  router.post('/api/instance/create', controller.api.instance.create)
  router.get('/*', controller.app.index)
}
