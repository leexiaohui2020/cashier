<template>
  <lee-layout>
    <div class="frame">
      <h2 class="margin-bottom-xl">会员注册</h2>
      <NInput
        ref="inputEmail"
        class="margin-bottom-lg"
        prefix="md-mail"
        v-model="form.email"
        placeholder="请填写邮箱"
      />

      <NInput
        ref="inputUserName"
        class="margin-bottom-lg"
        prefix="md-contact"
        v-model="form.username"
        placeholder="请填写用户名"
      />

      <NInput
        ref="inputPassword"
        type="password"
        class="margin-bottom-lg"
        prefix="md-lock"
        v-model="form.password"
        placeholder="请填写登录密码"
      />
      
      <NInput
        ref="inputRePassword"
        type="password"
        class="margin-bottom-lg"
        prefix="md-lock"
        v-model="form.repassword"
        placeholder="请再次确认密码"
      />

      <div class="frame-flex margin-bottom-lg">
        <div class="flex-sub margin-right-sm">
          <NInput ref="inputCode" v-model="form.code" prefix="md-key" placeholder="请填写验证码" />
        </div>
        <NButton @onclick="getCode" :disabled="codeSendBtnDisabled">{{ codeBufferText }}</NButton>
      </div>

      <NButton type="primary" :loading="loading" long @onclick="submit">完成注册</NButton>
    </div>
  </lee-layout>
</template>

<script>
import md5 from 'md5'
import NInput from 'web/ui/Input'
import NButton from 'web/ui/Button'

export default {
  name: 'PageRegist',
  components: { NInput, NButton },
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

    validate() {
      return this.$refs.inputEmail.assert(this.$validate.isEmail, '请填写格式正确的邮箱') &&
        this.$refs.inputUserName.assert(this.$validate.validAccount, '用户名长度至少六位，且只能填写字母数字和下划线，开头必须是字母') &&
        this.$refs.inputPassword.assert(this.$validate.validAccount, '密码长度至少六位，且只能填写字母数字和下划线，开头必须是字母') &&
        this.$refs.inputRePassword.assert(v => v && v === this.form.password, '两次密码输入不一致') &&
        this.$refs.inputCode.assert(v => v && v.length === 6, '请填写格式正确的验证码')
    },

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
      if (this.loading) return
      if (!await this.validate()) return
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
      this.$router.push({ 'name': 'login' })
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
