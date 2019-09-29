import { createElement } from 'common/js/dom'
import SvgIcon from 'common/asset/svg/bars.svg'
import './loading.less'

export default {
  bind(el, ref) {
    const loading = createLoadingEl()
    el.appendChild(loading)
    el.$loading = loading
    el.$loading.style.display = ref.value ? '' : 'none'
  },

  update(el, ref) {
    el.$loading.style.display = ref.value ? '' : 'none'
  }
}

function createLoadingEl() {
  return createElement('div', {
    staticClass: ['loading']
  }, [
    createElement('img', {
      staticClass: ['loading-img'],
      src: SvgIcon
    })
  ])
}
