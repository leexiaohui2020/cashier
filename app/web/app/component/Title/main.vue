<template>
  <div class="caption">
    <div class="caption-prefix" v-if="icon">
      <NIcon :type="icon" :color="iconColor" />
    </div>
    <slot />
    <div class="caption-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
import NIcon from 'web/ui/Icon'
export default {
  name: 'LeeTitle',
  components: { NIcon },
  props: {
    icon: String,
    iconColor: String
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>