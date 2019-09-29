<template>
  <div class="n-input" :class="`n-input-status_${status}`">
    <div class="n-input-prefix" v-if="prefix">
      <NIcon :type="prefix" />
    </div>
    <input v-model="content" :type="type" :placeholder="placeholder" class="n-input-control">
  </div>
</template>

<script>
import NIcon from '../Icon'
import NMessage from '../Message'
export default {
  name: 'NInput',
  components: { NIcon },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    prefix: String,
    value: {
      type: String,
      value: ''
    }
  },
  data() {
    return {
      content: this.value,
      status: String
    }
  },
  methods: {
    assert(func, message) {
      if (func(this.content)) {
        this.status = 'success'
        return true
      }
      this.status = 'error'
      NMessage.error(message)
      return false
    }
  },
  watch: {
    content(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.content = v;
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
