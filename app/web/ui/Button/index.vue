<template>
  <button :class="btnClass" @click="onClick">
    <NIcon class="n-btn-prefix" :spin="loading" :type="prefixIcon" v-if="prefixIcon" />
    <slot />
  </button>
</template>

<script>
import NIcon from '../Icon'
export default {
  name: 'NButton',
  components: { NIcon },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    long: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    loading: {
      type: Boolean,
      default: false
    },
    size: String
  },
  computed: {
    btnClass() {
      const list = ['n-btn']
      if (this.type) list.push(`n-btn-type_${this.type}`)
      if (this.long) list.push('n-btn-long')
      if (this.disabled) list.push('n-btn-disabled')
      if (this.loading) list.push('n-btn-loading')
      if (this.size) list.push(`n-btn-size_${this.size}`)
      return list
    },

    prefixIcon() {
      if (this.loading) {
        return 'md-refresh'
      }
      return this.icon
    }
  },
  methods: {
    onClick() {
      this.$emit('onclick')
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
