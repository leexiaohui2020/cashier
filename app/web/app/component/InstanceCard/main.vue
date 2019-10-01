<template>
  <div class="instance">
    <div class="instance-header">
      <h4 class="instance-title">{{ data.name }}</h4>
      <div class="instance-status" :class="data.statusColor">{{ data.statusText }}</div>
      <div class="instance-extra">
        <NDropdown ref="dropdown">
          <a href="javascript:;" class="instance-btn" slot="toggle">
            <NIcon type="md-more" />
          </a>
          <div class="instance-dropdown">
            <a href="javascript:;" class="instance-dropdown-item" @click="onBrowser">
              <NIcon class="icon" type="md-open" />
              <span>详情</span>
            </a>
            <a href="javascript:;" class="instance-dropdown-item">
              <NIcon class="icon" type="md-pause" />
              <span>暂停</span>
            </a>
            <a href="javascript:;" class="instance-dropdown-item">
              <NIcon class="icon" type="md-power" />
              <span>注销</span>
            </a>
          </div>
        </NDropdown>
      </div>
    </div>

    <div class="instance-desc">{{ data.description }}</div>
    <div class="instance-desc">
      <span class="instance-cup">{{ data.limitText }}</span>
      <span class="instance-cup">{{ data.expireText }}</span>
    </div>
    <div class="instance-desc instance-footer">
      <span>{{ data.callbackEmail }}</span>
      <span>{{ data.createdTime }}</span>
    </div>
  </div>
</template>

<script>
import NIcon from 'web/ui/Icon'
import NDropdown from 'web/ui/Dropdown'
export default {
  name: 'LeeInstanceCard',
  components: { NIcon, NDropdown },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    async onBrowser() {
      this.$emit('on-browser', this.data)
      this.$refs.dropdown.hideModal()
    }
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
