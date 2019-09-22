module.exports = app => {
  const { router, controller } = app

  router.post('/api/user/getCode', controller.api.user.getCode)
  router.post('/api/user/regist', controller.api.user.regist)
  router.get('/*', controller.app.index)
}
