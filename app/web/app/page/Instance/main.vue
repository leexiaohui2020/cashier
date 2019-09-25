<template>
  <div class="instance">
    <Row class="padding-bottom margin-bottom solid-bottom" type="flex" justify="space-between" align="middle">
      <h1 class="instance-title">实例列表</h1>
      <div>
        <Button class="margin-right-xs" size="large" @click="lstInstance">
          <Icon type="md-sync" size="18" />
        </Button>
        <Button type="primary" size="large" @click="createInstance">创建实例</Button>
      </div>
    </Row>

    <!-- 实例列表 -->
    <div class="instance-list">
      <div class="instance-item" v-for="(v, k) of list" :key="k">
        <InstanceCard :data="v" @on-browser="onBrowserInstance" />
      </div>
    </div>
  </div>
</template>

<script>
import InstanceCard from 'app/component/InstanceCard/main'
import CreateInstance from 'app/component/CreateInstance/main'
import { mapState } from 'vuex'

export default {
  name: 'PageInstance',
  components: {
    InstanceCard,
  },
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
  watch: {
    loading(flag) {
      this.$Loading[flag ? 'start' : 'finish']()
    }
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
