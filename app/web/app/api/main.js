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
