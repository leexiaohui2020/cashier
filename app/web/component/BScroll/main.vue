<template>
  <div ref="scroll" class="scroll-wrapper">
    <div class="scroll-content">
      <div class="scroll-content-main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDom from '@better-scroll/observe-dom'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
BScroll.use(ObserveDom)

export default {
  name: 'BScroll',
  computed: {
    scrollOptions() {
      return {
        slide: {
          loop: true,
          threshold: 100
        },
        momentum: false,
        bounce: {
          top: false,
          bottom: false
        },
        scrollbar: {
          fade: true,
          interactive: true
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        },
        observeDom: true,
        click: true
      }
    }
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, this.scrollOptions)
    },

    refresh() {
      this.bs && this.bs.refresh()
    }
  },
  mounted() {
    setTimeout(() => this.init(), 100)
    window.addEventListener('resize', () => this.refresh())
  },
  beforeDestroy() {
    this.bs.destroy()
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
