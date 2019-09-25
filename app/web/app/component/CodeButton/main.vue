<template>
  <Button :disabled="disabled" @click="$emit('on-click')">{{ text }}</Button>
</template>

<script>
export default {
  name: 'CodeButton',
  data() {
    return {
      bufferTime: 0
    }
  },
  computed: {
    text() {
      const time = this.bufferTime
      return time ? `重新发送(${time}s)` : '发送验证码'
    },

    disabled() {
      return this.bufferTime !== 0
    }
  },
  methods: {
    startBuffer() {
      if (this.tm) return
      this.bufferTime = 60
      this.tm = setInterval(() => {
        if (this.bufferTime === 0) {
          clearInterval(this.tm)
          delete this.tm
        } else {
          this.bufferTime --
        }
      }, 1000)
    },

    async sendCode(email, body) {
      this.startBuffer()
      const { data } = await this.$api.getCode({ email, body })
      if (data.status !== this.$api.ERR_OK) {
        return this.$Message.error(data.errmsg)
      }
      this.$Message.success('验证码已发送至您的邮箱')
    }
  },
  destroyed() {
    if (this.tm) {
      clearInterval(this.tm)
      delete this.tm
    }
  }
}
</script>