import axios from 'axios'

const instance = axios.create()

export const ERR_OK = 'ok'

// 获取邮箱激活码
export async function getCode(data = {}) {
  return await instance.post('/api/user/getCode', data)
}

// 注册会员
export async function regist(data = {}) {
  return await instance.post('/api/user/regist', data)
}