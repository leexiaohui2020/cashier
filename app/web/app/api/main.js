import axios from 'axios'

const instance = axios.create()

export const ERR_OK = 'ok'

// 获取邮箱激活码
export async function getCode(data = {}) {
  return await instance.post('/api/user/getCode', data)
}

// 获取邮箱激活码2
export async function sendCodeByAccount(data = {}) {
  return await instance.post('/api/user/sendCodeByAccount', data)
}

// 注册会员
export async function regist(data = {}) {
  return await instance.post('/api/user/regist', data)
}

// 会员登录
export async function login(data = {}) {
  return await instance.post('/api/user/login', data)
}

// 获取套餐
export async function getInstancePack(data = {}) {
  return await instance.post('/api/instance/getPack', data)
}

// 创建实例
export async function createInstance(data = {}) {
  return await instance.post('/api/instance/create', data)
}

// 实例列表
export async function getInstanceList(data = {}) {
  return await instance.post('/api/instance/lst', data)
}

// 实例详情
export async function getInstanceDetail(data = {}) {
  return await instance.post('/api/instance/dsp', data)
}

// 微信收款设置
export async function setWeixin(data = {}) {
  return await instance.post('/api/instance/setWeixin', data)
}
// 支付宝收款设置
export async function setZhifubao(data = {}) {
  return await instance.post('/api/instance/setZhifubao', data)
}

// 身份校验
export async function checkAuth(data = {}) {
  return await instance.post('/api/user/checkAuth', data)
}

// 邮箱换绑
export async function changeEmail(data = {}) {
  return await instance.post('/api/instance/changeEmail', data)
}

// 更换回调地址
export async function changeCallbackUrl(data = {}) {
  return await instance.post('/api/instance/changeCallbackUrl', data)
}

// 打开实例
export async function startInstance(data = {}) {
  return await instance.post('/api/instance/start', data)
}

// 停用实例
export async function pauseInstance(data = {}) {
  return await instance.post('/api/instance/pause', data)
}

// 查询订单
export async function dspOrder(data = {}) {
  return await instance.post('/api/order/dsp', data)
}

// 提交付款检查
export async function payExamineRequest(data = {}) {
  return await instance.post('/api/order/payExamineRequest', data)
}

// 付款检查通过
export async function payExamineOk(data = {}) {
  return await instance.post('/api/order/payExamineOk', data)
}

// 付款检查失败
export async function payExamineNo(data = {}) {
  return await instance.post('/api/order/payExamineNo', data)
}