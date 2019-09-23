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
