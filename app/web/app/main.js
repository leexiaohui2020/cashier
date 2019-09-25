import Vue from 'vue'
import App from 'common/app'
import index from './main.vue'
import createStore from './store'
import createRouter from './router'
import VueLazyLoad from 'vue-lazyload'
import Loading from './utils/loading'
import Dialog from './utils/dialog'
import Validate from './utils/validate'
import iView from 'iview'
import VueClipboards from 'vue-clipboards'
import * as api from './api/main'
import 'web/component'
import 'common/style/base.less'
import './main.less'

Vue.use(iView)
Vue.use(Loading)
Vue.use(VueLazyLoad)
Vue.use(Dialog)
Vue.use(VueClipboards)
Vue.use(Validate)

Vue.prototype.$api = api

Vue.filter('image', filename => `http://127.0.0.1:18081/image/${filename}`)

export default new App({
  index,
  createStore,
  createRouter
}).bootstrap()
