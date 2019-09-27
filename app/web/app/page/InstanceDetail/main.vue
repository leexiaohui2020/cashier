<template>
  <lee-layout>
    <div class="detail-loading" v-if="loading">
      <div v-loading="loading"></div>
    </div>
    <div class="detail" v-else>
      <header class="detail-header">
        <div class="detail-header-caption">
          <h1 class="title" @click="$router.back()">
            <Icon type="ios-undo" />
            <span>实例详情 - {{ detail.name }}</span>
          </h1>
          <div class="desc">
            <span>{{ detail.packName }}</span>
            <span>{{ detail.callbackEmail }}</span>
            <span>{{ detail.createdTime | moment }} 创建</span>
            <span>
              <Tag size="small" :color="detail.statusMap.color">{{ detail.statusMap.text }}</Tag>
            </span>
          </div>
        </div>
        <div class="padding-top">
          <Button type="primary" size="large" icon="md-play" :loading="starting" v-if="detail.status === 1" @click="startInstance">运行实例</Button>
          <Button size="large" icon="md-pause" :loading="pausing" v-if="detail.status === 0" @click="pauseInstance">停止使用</Button>
          <Button class="margin-left-xs" size="large" icon="md-trash">删除实例</Button>
        </div>
      </header>

      <Card shadow>
        <Row type="flex">
          <div class="flex-sub">
            <h4 class="text-color-l margin-bottom-xs">今日订单量</h4>
            <div style="font-weight: 600">
              <span style="font-size: 40px">{{ detail.countOrder.today }}</span>
              <span class="text-color-l">条 / {{ detail.limit }} 条</span>
            </div>
          </div>
          <div class="flex-sub">
            <h4 class="text-color-l margin-bottom-xs">本月订单量</h4>
            <div style="font-weight: 600">
              <span style="font-size: 40px">{{ detail.countOrder.tomonth }}</span>
              <span class="text-color-l">条</span>
            </div>
          </div>
        </Row>

        <Row class="margin-top" type="flex">
          <div class="flex-sub">
            <div>
              <span class="text-bold">实例ID：{{ detail.instanceId }}</span>
              <a href="javascript:;" v-clipboard="detail.instanceId" @success="onCopySuccess">
                <Icon type="md-copy" />
              </a>
            </div>
            <div>
              <span class="text-bold">实例秘钥：{{ detail.instanceSecret }}</span>
              <a href="javascript:;" v-clipboard="detail.instanceSecret" @success="onCopySuccess">
                <Icon type="md-copy" />
              </a>
            </div>
          </div>

          <div class="flex-sub" style="position: relative">
            <div>离到期剩余时间天数：{{ detail.expireDay }}</div>
            <div class="text-color-l">到期日期：{{ detail.expireTime | moment }}</div>
            <div style="position: absolute; right:0; top: 0">
              <a href="javascript:;">升级</a>
              <a class="margin-left-sm" href="javascript:;">续费</a>
            </div>
          </div>
        </Row>
      </Card>

      <Card class="margin-top" title="实例设置" shadow>
        <div class="detail-panel">
          <div class="label">收款微信</div>
          <div class="value" :class="`text-${detail.weixinSetting ? 'green' : 'red'}`">{{ detail.weixinSetting ? '已' : '未' }}配置</div>
          <div class="extra">
            <a href="javascript:;" @click="setWeixin">{{ detail.weixinSetting ? '修改' : '设置' }}</a>
          </div>
        </div>
        <div class="detail-panel">
          <div class="label">收款支付宝</div>
          <div class="value" :class="`text-${detail.zhifubaoSetting ? 'green' : 'red'}`">{{ detail.zhifubaoSetting ? '已' : '未' }}配置</div>
          <div class="extra">
            <a href="javascript:;" @click="setZhifuBao">{{ detail.zhifubaoSetting ? '修改' : '设置' }}</a>
          </div>
        </div>
        <div class="detail-panel">
          <div class="label">通知邮箱</div>
          <div class="value">{{ detail.callbackEmail }}</div>
          <div class="extra">
            <a href="javascript:;" @click="changeEmail">更换</a>
          </div>
        </div>
        <div class="detail-panel">
          <div class="label">回调地址</div>
          <div class="value">
            <span v-if="detail.callbackUrl">
              <span>{{ detail.callbackUrl }}</span>
              <Tag :color="detail.callbackUrlCanUse ? 'green' : 'orange'">{{ detail.callbackUrlCanUse ? '可访问' : '不可访问' }}</Tag>
            </span>
            <span class="text-red" v-else>未配置</span>
          </div>
          <div class="extra">
            <a href="javascript:;" @click="changeCallbackUrl">{{ detail.callbackUrl ? '修改' : '设置' }}</a>
          </div>
        </div>
      </Card>
    </div>
  </lee-layout>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import Dialog from './components/Dialog/main'
import DialogChangeEmail from './components/DialogChangeEmail/main'

export default {
  name: 'PageInstanceDetail',
  data() {
    return {
      detail: null,
      loading: true,
      pausing: false,
      starting: false
    }
  },
  methods: {
    async dspInstance(isid) {
      const { data } = await this.$api.getInstanceDetail({ isid })
      if (data.status !== this.$api.ERR_OK) {
        this.$Message.error(data.errmsg)
        this.$router.back()
        return
      }
      this.loading = false
      this.detail = data.data
    },

    async setWeixin() {
      const self = this
      const form = {}
      if (this.detail.weixin) {
        form.number = this.detail.weixin.number || ''
        form.qrcode = Vue.filter('image')(this.detail.weixin.qrcode)
      }

      new self.$Dialog({
        data() {
          return {
            title: '设置微信收款账号',
            loading: false,
            form
          }
        },
        components: { Dialog },
        methods: {
          async onSubmit(form) {
            if (this.loading) return
            this.loading = true
            const isid = self.$route.query.isid
            const { data } = await this.$api.setWeixin({ isid, ...form })
            this.loading = false
            if (data.status !== this.$api.ERR_OK) {
              return this.$Message.error(data.errmsg)
            }
            this.$Message.success('设置成功')
            this.close()
            await self.dspInstance(isid)
          }
        },
        template: '<Dialog :loading="loading" :form="form" @on-submit="onSubmit" />'
      }).open()
    },

    async setZhifuBao() {
      const self = this
      const form = {}
      if (this.detail.zhifubao) {
        form.number = this.detail.zhifubao.number || ''
        form.qrcode = Vue.filter('image')(this.detail.zhifubao.qrcode)
      }

      new self.$Dialog({
        data() {
          return {
            title: '设置支付宝收款账号',
            loading: false,
            form
          }
        },
        components: { Dialog },
        methods: {
          async onSubmit(form) {
            if (this.loading) return
            this.loading = true
            const isid = self.$route.query.isid
            const { data } = await this.$api.setZhifubao({ isid, ...form })
            this.loading = false
            if (data.status !== this.$api.ERR_OK) {
              return this.$Message.error(data.errmsg)
            }
            this.$Message.success('设置成功')
            this.close()
            await self.dspInstance(isid)
          }
        },
        template: '<Dialog :loading="loading" :form="form" @on-submit="onSubmit" />'
      }).open()
    },

    async changeEmail() {
      const self = this
      new self.$Dialog({
        data() {
          return {
            title: '更换邮箱',
            email: self.detail.callbackEmail,
            loading: false
          }
        },
        components: { DialogChangeEmail },
        methods: {
          async onSubmit(form) {
            if (this.loading) return
            this.loading = true
            const isid = self.detail._id
            const { data } = await this.$api.changeEmail({ isid, ...form })
            this.loading = false
            if (data.status !== this.$api.ERR_OK) {
              return this.$Message.error(data.errmsg)
            }
            this.$Message.success('操作成功')
            this.close()
            self.dspInstance(isid)
          }
        },
        template: '<DialogChangeEmail :source-email="email" :loading="loading" @on-submit="onSubmit" />'
      }).open()
    },

    async changeCallbackUrl() {
      const self = this
      new self.$Dialog({
        data() {
          return {
            width: 300,
            title: '设置回调地址',
            url: self.detail.callbackUrl || '',
            loading: false
          }
        },
        computed: {
          disabled() {
            return !this.url || this.url === self.detail.callbackUrl
          }
        },
        methods: {
          async onSubmit() {
            if (this.loading) return
            if (!this.url) return
            this.loading = true
            const isid = self.detail._id
            const url = this.url
            const { data } = await this.$api.changeCallbackUrl({ url, isid })
            this.loading = false
            if (data.status !== this.$api.ERR_OK) {
              return this.$Message.error(data.errmsg)
            }
            this.$Message.success('操作成功')
            this.close()
            await self.dspInstance(isid)
          }
        },
        template: `
        <Form>
          <FormItem label="回调地址">
            <i-input v-model="url" />
          </FormItem>
          <Button type="primary" :disabled="disabled" :loading="loading" long @click="onSubmit">保存设置</Button>
        </Form>
        `
      }).open()
    },

    async onCopySuccess() {
      this.$Message.success('复制成功')
    },

    async pauseInstance() {
      if (this.pausing) return
      this.pausing = true
      const isid = this.detail._id
      const { data } = await this.$api.pauseInstance({ isid })
      this.pausing = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      await this.dspInstance(isid)
    },
    
    async startInstance() {
      if (this.starting) return
      this.starting = true
      const isid = this.detail._id
      const { data } = await this.$api.startInstance({ isid })
      this.starting = false
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      await this.dspInstance(isid)
    }
  },
  filters: {
    moment(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  beforeRouteEnter(to, from, next) {
    const lastRoute = { name: 'instance' }
    const { isid } = to.query
    isid ? next(async vm => {
      vm.dspInstance(isid)
    }) : next(lastRoute)
  },
  installRouter(router) {
    router.regist('instance-detail', '/instance/detail', this, {
      auth: true,
      title: '实例详情'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>