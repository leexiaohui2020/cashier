<template>
  <div class="n-msg n-animated faster" :class="`n-msg-status_${type}`" @animationend="onAnimationEnd">
    <NIcon :type="icon" v-if="icon" />
    <span>{{ msg }}</span>
  </div>
</template>

<script>
import NIcon from '../Icon'
export default {
  name: 'NMessage',
  components: { NIcon },
  props: {
    type: String,
    msg: String,
    duration: {
      type: Number,
      default: 3000
    }
  },
  computed: {
    enterAnimateName() {
      if (this.type === 'error') {
        return 'n-wobble'
      }
      return 'n-zoom-in'
    },

    leaveAnimateName() {
      return 'n-zoom-out'
    },

    icon() {
      if (this.type === 'success') {
        return 'md-checkmark-circle-outline'
      }
      if (this.type === 'error') {
        return 'md-close-circle-outline'
      }
    }
  },
  methods: {
    onEnter() {
      const width = this.$el.offsetWidth
      const height = this.$el.offsetHeight
      this.$el.style.top = `calc(50% - ${ height / 2 }px)`
      this.$el.style.left = `calc(50% - ${ width / 2 }px)`
      this.$el.classList.add(this.enterAnimateName)
      this.tm = setTimeout(() => {
        this.$el.classList.remove(this.enterAnimateName)
        this.$el.classList.add(this.leaveAnimateName)
      }, this.duration)
    },

    onAnimationEnd() {
      if (this.$el.classList.contains(this.leaveAnimateName)) {
        this.$destroy()
      }
    }
  },
  mounted() {
    this.onEnter()
  },
  beforeDestroy() {
    console.info(this.tm, this.$el)
    clearTimeout(this.tm)
    this.$el.remove()
  }
}
</script>

<style lang="less" scoped>
@import '../common/style/animate';
@import 'index';
</style>
