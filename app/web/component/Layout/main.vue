<template>
  <div class="layout">
    <header class="layout-header">
      <div class="layout-header-brand"></div>
      <ul class="layout-menu" :class="{ open: menuShow }">
        <router-link tag="li" class="layout-menu-item" :class="{ active: active === v.id }" v-for="(v, k) of menu" :key="k" :to="v.link">
          <span>{{ v.title }}</span>
        </router-link>
      </ul>
      <div class="layout-header-extra">
        <a href="javascript:;" class="icon-btn">
          <Icon type="md-log-in" />
          <span>登入</span>
        </a>
        <a href="javascript:;" class="icon-btn">
          <Icon type="md-create" />
          <span>注册</span>
        </a>
        <a href="javascript:;" class="icon-btn hide-pc" @click="menuShow = !menuShow">
          <Icon :type="`md-${menuShow ? 'close' : 'menu'}`" />
        </a>
      </div>
    </header>

    <main class="layout-main">
      <slot />
    </main>
    <footer class="layout-footer">
      <p>© 2019 程序设计：橙续缘</p>
      <p>粤ICP备18083394号</p>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LeeLayout',
  props: {
    active: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      menuShow: false
    }
  },
  computed: {
    ...mapState('app', ['menu'])
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
