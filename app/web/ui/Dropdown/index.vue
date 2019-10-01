<template>
  <div class="dropdown">
    <div class="dropdown-toggle" :class="{ active: modalShow }" @click="toggleModal" @touchend="toggleModal">
      <slot name="toggle" />
    </div>
    <div class="dropdown-cover" ref="cover">
      <div ref="modal" class="dropdown-modal n-animated faster">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NDropdown',
  data() {
    return {
      modalShow: false
    }
  },
  methods: {
    showModal() {
      this.modalShow = true
      const { top, left, width, height } = this.$el.getBoundingClientRect()
      const { clientWidth, clientHeight } = document.documentElement
      const margin = 5

      const right = clientWidth - left - width
      const bottom = clientHeight - top - height

      if (bottom >= top) {
        this.cover.style.top = `${top + height + margin}px`
      } else {
        this.cover.style.bottom = `${bottom + height + margin}px`
      }

      if (right >= left) {
        this.cover.style.left = `${left + width + margin}px`
      } else {
        this.cover.style.right = `${right}px`
      }

      document.body.appendChild(this.cover)
      this.modal.classList.add('n-zoom-in')
      const tm = setTimeout(() => {
        clearTimeout(tm)
        document.addEventListener('click', this.documentClick)
      })
    },
    hideModal() {
      this.modalShow = false
      this.modal.classList.add('n-zoom-out')
      document.removeEventListener('click', this.documentClick)
    },
    toggleModal() {
      this.modalShow ? this.hideModal() : this.showModal()
    },

    documentClick(e) {
      if (!e.path.includes(this.modal)) {
        this.hideModal()
      }
    }
  },
  mounted() {
    this.cover = this.$refs.cover
    this.modal = this.$refs.modal
    this.cover.remove()
    this.modal.addEventListener('animationend', () => {
      if (this.modal.classList.contains('n-zoom-out')) {
        this.modal.classList.remove('n-zoom-in')
        this.modal.classList.remove('n-zoom-out')
        this.cover.remove()
      }
    })
  },
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
