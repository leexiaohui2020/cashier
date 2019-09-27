<template>
  <div v-if="loading">
    <div class="examine" v-loading="loading"></div>
  </div>
  <div class="examine" v-else>
    <div v-if="msg">
      <span>{{ msg }}，</span>
      <router-link to="/">去主页瞧瞧</router-link>
    </div>

    <template v-if="action">
      <div class="examine-icon" :class="`text-${action === 'checkmark' ? 'green' : 'red'}`">
        <Icon :type="`md-${action}-circle`" />
      </div>
      <p>已经{{ action === 'checkmark' ? '通过' : '关闭' }}了这笔付款审核</p>
      <router-link to="/" class="p">去主页瞧瞧</router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PageCashierOk',
  data() {
    return {
      msg: '',
      loading: true,
      action: null
    }
  },
  methods: {
    async loadFail(msg) {
      this.msg = msg
    },

    async payExamineOk(orderId, instanceId, instanceSecret) {
      const { data } = await this.$api.payExamineOk({ orderId, instanceId, instanceSecret })
      console.info(data)
      if (data.status !== this.$api.ERR_OK) {
        return this.msg = data.errmsg
      }
      this.action = 'checkmark'
    },

    async payExamineNo(orderId, instanceId, instanceSecret) {
      const { data } = await this.$api.payExamineNo({ orderId, instanceId, instanceSecret })
      console.info(data)
      if (data.status !== this.$api.ERR_OK) {
        return this.msg = data.errmsg
      }
      this.action = 'close'
    }
  },
  async mounted() {
    const { action, key } = this.$route.query
    const { instanceId, orderId } = this.$route.params
    if (
      !['yes', 'no'].includes(action) ||
      !this.$validate.isString(key) ||
      !this.$validate.isString(instanceId) ||
      !this.$validate.isString(orderId)
    ) {
      await this.loadFail('参数错误')
    } else if (action === 'yes') {
      await this.payExamineOk(orderId, instanceId, key)
    } else if (action === 'no') {
      await this.payExamineNo(orderId, instanceId, key)
    }
    this.loading = false
  },
  installRouter(router) {
    router.regist('cashier-examine', '/cashier/examine/:instanceId/:orderId', this, {
      title: '订单付款审核'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>