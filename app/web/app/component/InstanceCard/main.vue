<template>
  <div class="card">
    <Row class="card-content" type="flex" justify="space-between">
      <div>
        <h2>{{ data.name }}</h2>
        <p class="margin-top-xs">{{ data.expireText }} / {{ data.limitText }}</p>
        <p class="margin-top-xs" v-if="data.description">{{ data.description }}</p>
      </div>
      <div>
        <a href="javascript:;" @click.stop="onBrowser">详情</a>
        <a class="margin-left-xs" href="javascript:;">停止</a>
      </div>
    </Row>
    <Row type="flex" justify="space-between" align="middle">
      <div>
        <Tag type="dot" :color="data.statusColor">{{ data.statusText }}</Tag>
      </div>
      <div>
        <span>{{ data.callbackEmail }}</span>
      </div>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'LeeInstanceCard',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    async onBrowser() {
      this.$emit('on-browser', this.data)
    }
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
