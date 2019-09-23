<template>
  <div class="instance">
    <Row class="padding-bottom margin-bottom solid-bottom" type="flex" justify="space-between" align="middle">
      <h1 class="instance-title">实例列表</h1>
      <div>
        <Button class="margin-right-xs" size="large">
          <Icon type="md-sync" size="18" />
        </Button>
        <Button type="primary" size="large" @click="createInstance">创建实例</Button>
      </div>
    </Row>
  </div>
</template>

<script>
import CreateInstance from 'app/component/CreateInstance/main'
import { mapState } from 'vuex'

export default {
  name: 'PageInstanceControl',
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

        template: '<CreateInstance :uid="uid" @create-success="close" />'
      }).open()
    }
  },
  installRouter(router) {
    router.regist('instance-control', '/instance/control', this, {
      auth: true,
      title: '实例控制台'
    })
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
