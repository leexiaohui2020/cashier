<template>
  <div class="regist">
    <div class="regist-modal">
      <h1 class="regist-title margin-bottom">会员注册</h1>
      <Form ref="form" :model="form" :rules="rules">
        <FormItem prop="username">
          <i-input v-model="form.username" prefix="md-contact" placeholder="请填写用户名" />
        </FormItem>
        <FormItem prop="email">
          <i-input v-model="form.email" prefix="md-mail" placeholder="请填写邮箱" />
        </FormItem>
        <FormItem prop="password">
          <i-input v-model="form.password" type="password" prefix="md-lock" placeholder="请填写密码" />
        </FormItem>
        <FormItem prop="repassword">
          <i-input v-model="form.repassword" type="password" prefix="md-lock" placeholder="再次确认密码" />
        </FormItem>
        <FormItem prop="code">
          <Row type="flex" align="middle">
            <div class="flex-sub padding-right-xs">
              <i-input v-model="form.code" prefix="md-key" placeholder="请填写验证码" />
            </div>
            <Button @click="getCode" :disabled="codeSendBtnDisabled">{{ codeBufferText }}</Button>
          </Row>
        </FormItem>
        <Button type="primary" :loading="loading" long @click="submit">注册会员</Button>
      </Form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  name: 'PageRegist',
  data() {
    return {
      codeBufferTime: 0,
      form: {
        email: '',
        username: '',
        password: '',
        repassword: '',
        code: ''
      },
      rules: {
        email: [
          { required: true, message: '请填写邮箱' },
          { type: 'email', message: '请填写格式正确的邮箱' }
        ],
        username: [
          { required: true, message: '请填写用户名' },
          {
            validator: (rule, value, callback) => {
              if (this.$validate.validAccount(value)) {
                callback()
              } else {
                callback(new Error('用户名长度至少六位，且只能填写字母数字和下划线，开头必须是字母'))
              }
            }
          }
        ],
        password: [
          { required: true, message: '请填写密码' },
          {
            validator: (rule, value, callback) => {
              if (this.$validate.validAccount(value)) {
                callback()
              } else {
                callback(new Error('密码长度至少六位，且只能填写字母数字和下划线，开头必须是字母'))
              }
            }
          }
        ],
        repassword: [
          { required: true, message: '请填写确认密码' },
          {
            validator: (rule, value, callback) => {
              if (this.form.password === value) {
                callback()
              } else {
                callback(new Error('确认密码不一致'))
              }
            }
          }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { min: 6, max: 6, message: '验证码格式错误' }
        ]
      },
      loading: false
    }
  },
  computed: {
    codeBufferText() {
      const time = this.codeBufferTime
      return time ? `重新发送(${time}s)` : '发送验证码'
    },

    codeSendBtnDisabled() {
      return this.codeBufferTime !== 0
    }
  },
  methods: {

    startCodeBuffer() {
      if (this.tm) return
      this.codeBufferTime = 60
      this.tm = setInterval(() => {
        if (this.codeBufferTime === 0) {
          clearInterval(this.tm)
          delete this.tm
        } else {
          this.codeBufferTime --
        }
      }, 1000)
    },

    async getCode() {
      if (this.codeSendBtnDisabled) return
      const { email } = this.form
      if (!this.$validate.isString(email)) {
        return this.$Message.error('请填写邮箱')
      }
      if (!this.$validate.isEmail(email)) {
        return this.$Message.error('请填写格式正确的邮箱')
      }
      this.startCodeBuffer()
      const body = '注册易收银平台会员账号'
      const { data } = await this.$api.getCode({ email, body })
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('验证码已发送')
    },

    async submit() {
      console.info(!await this.$refs.form.validate())
      if (this.loading) return
      if (!await this.$refs.form.validate()) return
      let { email, username, password, code } = this.form
      password = md5(password).toUpperCase()
      this.loading = true
      const { data } = await this.$api.regist({
        email,
        username,
        password,
        code
      })
      this.loading = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('注册成功')
    }
  },
  destroyed() {
    if (this.tm) {
      clearInterval(this.tm)
    }
  },
  installRouter(router) {
    router.regist('regist', '/regist', this, {
      title: '注册'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
