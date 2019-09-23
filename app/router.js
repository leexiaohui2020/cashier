module.exports = app => {
  const { router, controller } = app

  router.post('/api/user/getCode', controller.api.user.getCode)
  router.post('/api/user/regist', controller.api.user.regist)
  router.post('/api/user/sendCodeByAccount', controller.api.user.sendCodeByAccount)
  router.post('/api/user/login', controller.api.user.login)
  router.get('/*', controller.app.index)
}
