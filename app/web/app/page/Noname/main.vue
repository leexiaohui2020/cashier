<template>
  <div class="box">
    <div class="box-card">
      <header class="box-caption">
        <h1 class="box-title">无名杀 - 官渡之战</h1>
        <u>付费升级版</u>
      </header>

      <main>
        <ol class="box-list">
          <li>支持代替对应选择武将</li>
          <li>支持代替队友行动</li>
          <li>常规模式下可以使用专属武将包</li>
          <li>支持自由选择五金阵型</li>
          <li>支持无限使用手气卡</li>
          <li>专属武将包支持联机使用</li>
        </ol>

        <div class="box-price">￥ 5</div>
        <label>请填写您的邮箱已便发货：</label>
        <i-input v-model="email" prefix="md-mail" placeholder="请填写您的邮箱已便发货" />
        <Button class="margin-top" type="error" :disabled="email.length === 0" :loading="loading" long @click="onSubmit">立即支持</Button>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const instanceId = '7B802B770955BD7127AB5B371D04855C'
const instanceSecret = '72E82D2DC6D11EF0263D0AA62119746F'

export default {
  name: 'PageNoname',
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async createOrder(email) {
      const { data } = await axios.post('https://epay.leexiaohui.top/open-api/order/create', {
        title: '官渡之战升级版',
        description: '无名杀乱斗模式扩展 —— 官渡之战，付费升级版，24小时内自动发货',
        totalFee: 500,
        email
      }, {
        headers: {
          'x-instance-id': instanceId,
          'x-instance-secret': instanceSecret
        }
      })
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      const { number } = data.data
      window.open(`https://epay.leexiaohui.top/cashier?no=${number}`, '_blank')
    },

    async onSubmit() {
      if (this.loading) return
      const { email } = this
      if (!this.$validate.isEmail(email)) {
        return this.$Message.error('请填写格式正确的邮箱')
      }
      this.loading = true
      await this.createOrder(email)
      this.loading = false
    }
  },
  installRouter(router) {
    router.regist('noname', '/noname', this, {
      title: '官渡之战升级版 - 无名杀乱斗扩展'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>