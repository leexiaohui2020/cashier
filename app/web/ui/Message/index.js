import Vue from 'vue'
import Message from './index.vue'
import { createElement } from 'common/js/dom'

function createInstance(type, msg) {
  const el = createElement()
  const instance = new Vue({
    render: h => h(Message, {
      props: { type, msg }
    })
  })

  document.body.appendChild(el)
  instance.$mount(el)
}

export default window.a = {
  success: (msg) => createInstance('success', msg),
  error: (msg) => createInstance('error', msg)
}
