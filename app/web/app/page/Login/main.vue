<template>
  <div class="login">
    <div class="login-modal">
      <h1 class="login-title">会员登录</h1>
      <Form ref="form" :model="form" :rules="rules">
        <FormItem prop="account">
          <i-input v-model="form.account" prefix="md-contact" placeholder="请填写用户名/邮箱" />
        </FormItem>
        <FormItem prop="password">
          <i-input v-model="form.password" type="password" prefix="md-lock" placeholder="请填写密码" />
        </FormItem>
        <FormItem prop="code">
          <Row type="flex" align="middle">
            <div class="flex-sub padding-right-xs">
              <i-input v-model="form.code" prefix="md-key" placeholder="请填写验证码" />
            </div>
            <Button :disabled="sendCodeDisabled" @click="sendCode">{{ codeBufferText }}</Button>
          </Row>
        </FormItem>
        <Button type="primary" long :loading="loading" @click="submit">登录</Button>
      </Form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import storage from 'common/js/storage'
export default {
  name: 'PageLogin',
  data() {
    return {
      codeBufferTime: 0,
      form: {
        account: '',
        password: '',
        code: ''
      },
      rules: {
        account: [{ required: true, message: '请填写用户名/邮箱' }],
        password: [{ required: true, message: '请填写密码' }],
        code: [
          { required: true, message: '请填写验证码'},
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

    sendCodeDisabled() {
      return this.codeBufferTime > 0
    }
  },
  methods: {
    startCodeBuffer() {
      if (this.tm) return
      this.codeBufferTime = 60
      this.tm = setInterval(() => {
        if (this.tm === 0) {
          clearInterval(this.tm)
        } else {
          this.codeBufferTime --
        }
      }, 1000)
    },

    async sendCode() {
      if (this.sendCodeDisabled) return
      const { account } = this.form
      if (!this.$validate.isString(account)) {
        return this.$Message.error('请填写用户名/邮箱')
      }

      this.startCodeBuffer()
      const body = '登录易收银平台帐号'
      const { data } = await this.$api.sendCodeByAccount({ account, body })
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('验证码已发送至您的邮箱')
    },

    async submit() {
      if (this.loading) return
      if (!await this.$refs.form.validate()) return
      let { account, password, code } = this.form
      password = md5(password).toUpperCase()
      this.loading = true
      const { data } = await this.$api.login({ account, password, code })
      this.loading = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('登录成功')
      this.$store.commit('user/setState', data.data)
      storage.setItem('last_login_account', {
        account: this.form.account,
        password: this.form.password
      })
      this.$router.push({ name: 'home' })
    }
  },
  mounted() {
    const lastLoginAccount = storage.getItem('last_login_account')
    if (lastLoginAccount) {
      this.form.account = lastLoginAccount.account
      this.form.password = lastLoginAccount.password
    }
  },
  destroyed() {
    if (this.tm) {
      clearInterval(this.tm)
    }
  },
  installRouter(router) {
    const store = router.getStore()
    const isAuth = store.getters['user/isAuth']
    router.regist('login', '/login', this, {
      title: '登录'
    })

    if (EASY_ENV_IS_BROWSER) {
      router.before((to, from, next) => {
        if (to.meta.auth === true && !isAuth) {
          return next({ name: 'login' })
        }
        if (to.name === 'login' && isAuth) {
          return next({ name: 'home' })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
