<template>
  <lee-layout>
    <div class="frame">
      <h2 class="margin-bottom-xl">会员登录</h2>

      <NInput
        ref="inputAccount"
        class="margin-bottom-lg"
        prefix="md-contact"
        v-model="form.account"
        placeholder="请填写帐号/邮箱"
      />

      <NInput
        ref="inputPassword"
        type="password"
        class="margin-bottom-lg"
        prefix="md-lock"
        v-model="form.password"
        placeholder="请填写登录密码"
      />

      <div class="frame-flex margin-bottom-lg">
        <div class="flex-sub margin-right-sm">
          <NInput ref="inputCode" v-model="form.code" prefix="md-key" placeholder="请填写验证码" />
        </div>
        <NButton @onclick="sendCode" :disabled="sendCodeDisabled">{{ codeBufferText }}</NButton>
      </div>

      <NButton type="primary" :loading="loading" long @onclick="submit">登录</NButton>
    </div>
  </lee-layout>
</template>

<script>
import md5 from 'md5'
import storage from 'common/js/storage'
import NInput from 'web/ui/Input'
import NButton from 'web/ui/Button'

export default {
  name: 'PageLogin',
  components: { NInput, NButton },
  data() {
    return {
      codeBufferTime: 0,
      form: {
        account: '',
        password: '',
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

    sendCodeDisabled() {
      return this.codeBufferTime > 0
    }
  },
  methods: {
    startCodeBuffer() {
      if (this.tm) return
      this.codeBufferTime = 60
      this.tm = setInterval(() => {
        if (this.codeBufferTime === 0) {
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

    async validate() {
      return this.$refs.inputAccount.assert(v => v, '请填写帐号/邮箱') &&
        this.$refs.inputPassword.assert(v => v, '请填写密码') &&
        this.$refs.inputCode.assert(v => v && v.length === 6, '请填写格式正确的验证码')
    },

    async submit() {
      if (this.loading) return
      if (!await this.validate()) return
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

    router.regist('login', '/login', this, {
      title: '登录'
    })

    router.before((to, from, next) => {
      const isAuth = store.getters['user/isAuth']
      if (to.meta.auth === true && !isAuth) {
        next({ name: 'login' })
        return true
      }

      if (to.name === 'login' && isAuth) {
        next({ name: 'home' })
        return true
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
