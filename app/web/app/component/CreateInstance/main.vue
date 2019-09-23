<template>
  <div class="create">
    <h2 class="margin-bottom-lg padding-bottom-sm solid-bottom">创建应用实例</h2>
    <Form ref="form" :label-width="80" :model="form" :rules="rules">
      <FormItem label="实例名称" prop="name">
        <i-input v-model="form.name" />
      </FormItem>
      <FormItem label="实例描述">
        <i-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </FormItem>
      <FormItem label="通知邮箱" prop="callbackEmail">
        <Row type="flex" align="middle">
          <div class="flex-sub margin-right-xs">
            <i-input v-model="form.callbackEmail" />
          </div>
          <div class="margin-right-xs">
            <i-input prefix="md-key" placeholder="请填写验证码" v-model="form.code" />
          </div>
          <Button :disabled="codeBtnDisabled" @click="sendCode">{{ codeBufferText }}</Button>
        </Row>
      </FormItem>
      <FormItem label="选择套餐" prop="packId">
        <PackChooser v-model="packIndex" :list="pack" />
      </FormItem>
      <FormItem label="收款方式">
        <CheckboxGroup v-model="form.checkbox">
          <Checkbox label="wx" disabled>微信</Checkbox>
          <Checkbox label="zfb" disabled>支付宝</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <Row class="margin-top-xl padding-top padding-lr-xl solid-top" type="flex" justify="space-between" align="middle">
        <div>应付费用：<span class="create-price">{{ price }}</span></div>
        <div>
          <Button type="error" size="large" :loading="loading" @click="onsubmit">立即创建</Button>
        </div>
      </Row>
    </Form>
  </div>
</template>

<script>
import PackChooser from './PackChooser/main'

export default {
  name: 'LeeCreateInstance',
  components: { PackChooser },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pack: [],
      form: {
        name: '',
        description: '',
        callbackEmail: '',
        packId: 'normal',
        checkbox: ['wx', 'zfb'],
        code: ''
      },
      rules: {
        name: [{ required: true, message: '请填写实例名称' }],
        callbackEmail: [
          { required: true, message: '请填写通知邮箱' },
          { type: 'email', message: '请填写格式正确的邮箱' }
        ],
        packId: [{ required: true, message: '请选择套餐' }]
      },
      loading: false,
      codeBufferTime: 0
    }
  },
  computed: {
    packIndex: {
      get() {
        const id = this.form.packId
        return this.pack.findIndex(item => item.id === id)
      },
      set(index) {
        const item = this.pack[index]
        if (item) {
          this.form.packId = item.id
        } else {
          this.form.packId = ''
        }
      }
    },

    price() {
      const item = this.pack[this.packIndex]
      return item ? item.price : ''
    },

    codeBufferText() {
      const time = this.codeBufferTime
      return time ? `重新发送(${time}s)` : '发送验证码'
    },

    codeBtnDisabled() {
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
      if (this.tm) return
      if (this.codeBtnDisabled) return
      const email = this.form.callbackEmail
      if (!this.$validate.isEmail(email)) {
        return this.$Message.error('请填写格式正确的邮箱')
      }
      const body = '创建易收银实例';
      this.startCodeBuffer()
      const { data } = await this.$api.getCode({ email, body })
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('验证码已发送至您的邮箱！')
    },

    async getInstancePack() {
      const { data } = await this.$api.getInstancePack()
      if (data.status === this.$api.ERR_OK) {
        this.pack = data.data
      }
    },

    async onsubmit() {
      if (this.loading) return
      if (!await this.$refs.form.validate()) return
      const { uid } = this
      const { name, description, packId, code, callbackEmail } = this.form
      if (!code) {
        return this.$Message.error('请填写验证码')
      }
      this.loading = true
      const { data } = await this.$api.createInstance({ uid, name, description, packId, code, callbackEmail })
      this.loading = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('创建成功')
      this.$emit('create-success');
    }
  },
  async created() {
    await this.getInstancePack()
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>