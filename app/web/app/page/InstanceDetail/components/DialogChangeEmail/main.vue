<template>
  <div v-loading="loading">
    <Steps class="margin-bottom" :current="current">
      <Step title="身份验证" />
      <Step title="绑定新邮箱" />
    </Steps>
    <!-- 身份验证 -->
    <div v-show="current === 0">
      <Form :label-width="60">
        <FormItem label="登录密码">
          <i-input v-model="password" type="password" placeholder="请输入您的登录密码" />
        </FormItem>
      </Form>
      <Row type="flex" justify="center">
        <Button type="primary" :disabled="password.length === 0" :loading="checking" size="large" @click="checkAuth" >下一步</Button>
      </Row>
    </div>
    <!-- 绑定新邮箱 -->
    <div v-show="current === 1">
      <Form ref="form" :label-width="60" :model="form" :rules="rules">
        <FormItem label="新邮箱" prop="email">
          <i-input v-model="form.email" />
        </FormItem>
        <FormItem label="验证码" prop="code">
          <Row type="flex">
            <div class="flex-sub margin-right-sm">
              <i-input v-model="form.code" />
            </div>
            <CodeButton ref="codeButton" @on-click="sendCode" />
          </Row>
        </FormItem>
      </Form>
      <Row type="flex" justify="center">
        <Button size="large" @click="current = 0">上一步</Button>
        <Button class="margin-left" type="primary" size="large" @click="onSubmit">确定</Button>
      </Row>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import CodeButton from 'app/component/CodeButton/main'
export default {
  name: 'DialogChangeEmail',
  components: { CodeButton },
  props: {
    sourceEmail: {
      type: String,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      current: 0,
      checking: false,
      password: '',
      form: {
        email: '',
        code: ''
      },
      rules: {
        email: [
          { required: true, message: '请填写邮箱' },
          { type: 'email', message: '请填写格式正确的邮箱' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { min: 6, max: 6, message: '验证码格式错误' }
        ]
      }
    }
  },
  methods: {
    async checkAuth() {
      if (this.checking) return
      this.checking = true
      const password = md5(this.password).toUpperCase()
      const { data } = await this.$api.checkAuth({ password })
      this.checking = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.current = 1
    },

    async sendCode() {
      const { email } = this.form
      if (!this.$validate.isEmail(email)) {
        return this.$Message.error('请填写格式正确的邮箱')
      }
      if (email === this.sourceEmail) {
        return this.$Message.error('请填写新邮箱')
      }
      await this.$refs.codeButton.sendCode(email, '更换实例通知邮箱')
    },

    async onSubmit() {
      if (!await this.$refs.form.validate()) return
      const { email, code } = this.form
      this.$emit('on-submit', { email, code })
    }
  }
}
</script>