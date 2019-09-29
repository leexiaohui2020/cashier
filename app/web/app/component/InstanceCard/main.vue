<template>
  <div class="instance">
    <div class="instance-caption">
      <div class="instance-control">
        <a href="javascript:;" @click.stop="onBrowser">详情</a>
        <a class="margin-left-xs" href="javascript:;">停止</a>
      </div>
      <div class="instance-info">
        <h2>{{ data.name }}</h2>
        <p class="margin-top-xs">{{ data.expireText }} / {{ data.limitText }}</p>
        <p class="margin-top-xs" v-if="data.description">{{ data.description }}</p>
      </div>
    </div>

    <div class="fc margin-top-xl">
      <div class="fl">
        <Tag type="dot" :color="data.statusColor">{{ data.statusText }}</Tag>
      </div>
      <div class="fr">
        <span>{{ data.callbackEmail }}</span>
      </div>
    </div>
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
