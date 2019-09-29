<template>
  <div class="layout" v-loading="loading">
    <div class="custom-header">
      <header class="layout-header">
        <router-link class="layout-header-brand" to="/" tag="div">
          <SiteLogo />
        </router-link>
        <ul class="layout-menu" :class="{ open: menuShow }">
          <template v-for="(v, k) of menu">
            <router-link tag="li" class="layout-menu-item" :class="{ active: active === v.id }" :key="k" :to="v.link" v-if="!(v.auth && !isAuth)">
              <span>{{ v.title }}</span>
            </router-link>
          </template>
        </ul>
        <div class="layout-header-extra">
          <router-link to="/login" class="icon-btn" v-show="!isAuth">
            <UIcon type="md-log-in" />
            <span>登入</span>
          </router-link>
          <router-link to="/regist" class="icon-btn" v-show="!isAuth">
            <UIcon type="md-create" />
            <span>注册</span>
          </router-link>

          <a href="javascript:;" class="icon-btn hide-pc" @click="menuShow = !menuShow">
            <UIcon :type="`md-${menuShow ? 'close' : 'menu'}`" />
          </a>
        </div>
      </header>
    </div>

    <BScroll class="layout-scroll">
      <main class="layout-main">
        <slot />
      </main>
      <footer class="layout-footer">
        <p>© 2019 程序设计：橙续缘</p>
        <p>粤ICP备18083394号</p>
      </footer>
    </BScroll>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import UIcon from 'web/ui/Icon'

export default {
  name: 'LeeLayout',
  components: { UIcon },
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
