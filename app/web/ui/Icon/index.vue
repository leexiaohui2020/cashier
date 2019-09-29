<template>
  <i :class="`icon ion-${type} ${spin ? 'spin' : ''}`" :style="iconStyle"></i>
</template>

<script>
export default {
  name: 'UIcon',
  props: {
    type: String,
    size: String,
    color: String,
    spin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconStyle() {
      const style = {}
      this.size && (style.fontSize = this.size)
      this.color && (style.color = this.color)
      return style
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ionicons/dist/css/ionicons.css';
@import '../common/style/animate';
.spin {
  display: inline-block;
  animation: rotate 1s linear infinite;
}
</style>
