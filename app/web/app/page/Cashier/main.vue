<template>
  <div v-if="loading">
    <div class="cashier" v-loading="loading"></div>
  </div>
  <div class="cashier" v-else>
    <div class="cashier-card" v-if="detail">
      <header class="cashier-header">
        <router-link class="cashier-title" to="/" tag="h1">收银台 - 易收银</router-link>
      </header>
      <main class="cashier-main">
        <div class="cashier-info">
          <h2 class="cashier-title">{{ detail.title }}</h2>
          <div class="cashier-price">{{ detail.totalFee / 100 }}</div>
        </div>

        <div class="cashier-form">
          <div class="cashier-form-item">
            <div class="cashier-form-label">付款方</div>
            <div class="cashier-form-value">{{ detail.email }}</div>
          </div>
          <div class="cashier-form-item">
            <div class="cashier-form-label">收款方</div>
            <div class="cashier-form-value">{{ detail.instanceName }}</div>
          </div>
          <div class="cashier-form-item" v-if="detail.description">
            <div class="cashier-form-label">商品详情</div>
            <div class="cashier-form-value">{{ detail.description }}</div>
          </div>
          <div class="cashier-form-item">
            <div class="cashier-form-label">流水号</div>
            <div class="cashier-form-value">{{ detail.orderNo }}</div>
          </div>
        </div>

        <template v-if="detail.status === 'create'">
          <Row class="margin-top-xl margin-bottom-sm" type="flex" align="middle" justify="space-between">
            <div>请向下方指定账户付款</div>
            <div>
              <span>请选择付款方式：</span>
              <RadioGroup v-model="payType" type="button" size="small">
                <Radio label="weixin">微信</Radio>
                <Radio label="zhifubao">支付宝</Radio>
              </RadioGroup>
            </div>
          </Row>

          <div class="cashier-account" v-show="payType === 'weixin'">
            <div class="cashier-account-qrcode">
              <img :src="detail.weixin.qrcode | image" >
            </div>
            <div class="cashier-account-number">微信账户：{{ detail.weixin.number }}</div>
          </div>

          <div class="cashier-account" v-show="payType === 'zhifubao'">
            <div class="cashier-account-qrcode">
              <img :src="detail.zhifubao.qrcode | image" >
            </div>
            <div class="cashier-account-number">微信账户：{{ detail.zhifubao.number }}</div>
          </div>

          <strong class="text-red">* 请在备注中填写您的电子邮箱，否则可能无法识别您的付款</strong>
          <Button class="margin-top-xs" type="primary" size="large" long @click="onConfirm">我已付款，请检查</Button>
        </template>
        
        <template v-else-if="detail.status === 'pay'">
          <div class="cashier-examine">审核中</div>
          <p class="cashier-mark">该订单已提交付款审核，请等待收款方于 48 小时内确认</p>
        </template>
      </main>
    </div>
    <div v-else>
      <span>{{ message }}，</span>
      <router-link to="/">去主页瞧瞧</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageCashier',
  data() {
    return {
      detail: null,
      loading: true,
      message: '',
      payType: ''
    }
  },
  methods: {
    async loadFail(message) {
      this.message = message
    },

    async loadOrder(number) {
      const { data } = await this.$api.dspOrder({ number })
      if (data.status === this.$api.ERR_OK) {
        this.detail = data.data
      } else {
        await this.loadFail(data.errmsg)
      }
    },

    async onConfirm() {
      this.$Modal.confirm({
        title: '提醒',
        content: '此按钮只可点击一次，是否确定您已向收款方付款？',
        loading: true,
        onOk: async () => {
          const number = this.detail.orderNo
          const { data } = await this.$api.payExamineRequest({ number })
          this.$Modal.remove()
          if (data.status !== this.$api.ERR_OK) {
            return this.$Message.error(data.errmsg)
          }
          location.reload()
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    const { no } = to.query
    next(async vm => {
      if (no) {
        await vm.loadOrder(no)
      } else {
        await vm.loadFail('实例尚未创建')
      }
      vm.loading = false
    })
  },
  installRouter(router) {
    router.regist('cashier', '/cashier', this, {
      title: '收银台'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>