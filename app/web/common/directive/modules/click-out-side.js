function bindEvent(el, func) {
  const factory = (e) => {
    if (!e.path.includes(el)) {
      func(e)
    }
  }
  document.addEventListener('touchstart', factory)
  document.addEventListener('click', factory)
  el.$vue_directive_click_out_side_remove = () => {
    document.removeEventListener('touchstart', factory)
    document.removeEventListener('click', factory)
  }
}

export default {
  bind(el, ref) {
    bindEvent(el, ref.value)
  },

  unbind(el) {
    el.$vue_directive_click_out_side_remove()
  }
}
