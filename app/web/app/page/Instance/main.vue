<template>
  <lee-layout active="control">
    <div class="frame">
      <div class="frame-side"></div>
      <div class="frame-side">
        <LeeTitle icon="md-apps">应用列表</LeeTitle>
        <InstanceCard v-for="(v, k) of list" :key="k" :data="v" />
      </div>
    </div>
  </lee-layout>
</template>

<script>
import InstanceCard from 'app/component/InstanceCard/main'
import CreateInstance from 'app/component/CreateInstance/main'
import { mapState } from 'vuex'
import LeeTitle from 'app/component/Title/main'

export default {
  name: 'PageInstance',
  components: { LeeTitle, InstanceCard },
  data() {
    return {
      page: 1,
      pagesize: 10,
      list: [],
      total: 0,

      loading: false
    }
  },
  computed: {
    ...mapState('user', ['uid'])
  },
  methods: {
    createInstance() {
      const self = this
      new self.$Dialog({

        data() {
          return {
            width: 600,
            uid: self.uid
          }
        },
        components: {
          CreateInstance
        },
        methods: {
          async onSuccess() {
            this.close()
            await self.refreshData()
          }
        },
        template: '<CreateInstance :uid="uid" @create-success="onSuccess" />'
      }).open()
    },

    async lstInstance(page = 1) {
      if (this.loading) return
      const uid = this.uid
      const { pagesize } = this
      const pager = { page, pagesize }
      this.loading = true
      const { data } = await this.$api.getInstanceList({ uid, pager })
      this.loading = false
      if (data.status === this.$api.ERR_OK) {
        this.page = data.data.page
        this.pagesize = data.data.pagesize
        this.total = data.data.total
        this.list = data.data.list
      }
    },

    async refreshData() {
      await this.lstInstance(this.page)
    },

    async onBrowserInstance(item) {
      const isid = item.id
      this.$router.push({ name: 'instance-detail', query: { isid } })
    }
  },
  async mounted() {
    await this.lstInstance()
  },
  installRouter(router) {
    router.regist('instance', '/instance', this, {
      auth: true,
      title: '实例控制台'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
