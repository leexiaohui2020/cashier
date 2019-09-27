<template>
  <div class="layout" v-loading="loading">
    <div class="custom-header">
      <header class="layout-header">
        <div class="layout-header-brand"></div>
        <ul class="layout-menu" :class="{ open: menuShow }">
          <template v-for="(v, k) of menu">
            <router-link tag="li" class="layout-menu-item" :class="{ active: active === v.id }" :key="k" :to="v.link" v-if="!(v.auth && !isAuth)">
              <span>{{ v.title }}</span>
            </router-link>
          </template>
        </ul>
        <div class="layout-header-extra">
          <router-link to="/login" class="icon-btn" v-show="!isAuth">
            <Icon type="md-log-in" />
            <span>登入</span>
          </router-link>
          <router-link to="/regist" class="icon-btn" v-show="!isAuth">
            <Icon type="md-create" />
            <span>注册</span>
          </router-link>

          <Dropdown transfer @on-click="onDropMenu" v-if="isAuth">
            <a href="javascript:;" class="icon-btn margin-lr-xs">
              <Icon type="md-contact" />
              <span>您好！{{ userInfo.email }}</span>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="logout">
                <Icon type="md-log-out" />
                <span>退出登录</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <a href="javascript:;" class="icon-btn hide-pc" @click="menuShow = !menuShow">
            <Icon :type="`md-${menuShow ? 'close' : 'menu'}`" />
          </a>
        </div>
      </header>
    </div>

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
import { mapState, mapGetters } from 'vuex'
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
      menuShow: false,
      loading: false
    }
  },
  computed: {
    ...mapState('app', ['menu']),
    ...mapState('user', ['userInfo']),
    ...mapGetters('user', ['isAuth'])
  },
  methods: {
    async onDropMenu(name) {
      await this[name]()
    },

    async startLoading() {
      this.loading = true
    },

    async finishLoading() {
      this.loading = false
    },

    async logout() {
      this.startLoading()
      await this.$api.logout()
      this.finishLoading()
      location.reload()  
    }
  }
}
</script>

<style lang="less" scoped>
@import 'main';
</style>
