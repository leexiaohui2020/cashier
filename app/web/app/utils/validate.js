export default (Vue) => {
  const ruleMap = []
  const addRule = (name, validator) => ruleMap.push({ name, validator })

  addRule('isString', v => typeof v === 'string' && v.length > 0)
  addRule('isEmail', v => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v))
  addRule('validAccount', v => /^[A-Za-z][A-Za-z0-9\_]{5,}$/.test(v))

  Vue.prototype.$validate = new Proxy(ruleMap, {
    get(target, key) {
      const item = target.find(v => v.name === key)
      if (!item || typeof item.validator !== 'function') {
        return null
      }
      return item.validator
    }
  })
}
