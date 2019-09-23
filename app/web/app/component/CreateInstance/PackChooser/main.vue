<template>
  <div class="pack">
    <div class="pack-item" :class="{ active: value === k }" v-for="(v, k) of list" :key="k" @click="onselect(v, k)">
      <div class="pack-title">{{ v.name }}</div>
      <div class="pack-detail">
        <div class="pack-detail-item">
          <div class="pack-detail-label">套餐费用/月</div>
          <div class="pack-detail-value">{{ v.price }}</div>
        </div>
        <div class="pack-detail-item">
          <div class="pack-detail-label">订单上限/日</div>
          <div class="pack-detail-value">{{ v.limit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeePackChooser',
  props: {

    list: {
      type: Array,
      default: () => []
    },

    value: {
      type: Number,
      default: -1
    }
  },
  methods: {
    onselect(item, index) {
      this.$emit('select', { item, index })
      this.$emit('input', index)
    }
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
