function getType(n) {
  return Object.prototype.toString.call(n).match(/\[object (\S*)\]/)[1]
}

export function createElement() {
  let tag, opts, childs
  Array.from(arguments).forEach(item => {
    const type = getType(item)
    if (type === 'String' && !tag) tag = item
    else if (type === 'Object' && !opts) opts = item
    else if (type ==='Array' && !childs) childs = item
  })

  const element = document.createElement(tag || 'div')
  Object.entries(opts || {}).forEach(([ index, item ]) => {
    if (index === 'style') {
      Object.entries(opts.style).forEach(([ key, value ]) => {
        element.style[key] = value
      })
    }

    if (index === 'staticClass') {
      opts.staticClass.forEach(item => element.classList.add(item))
    }

    element[index] = item
  });

  (childs || []).forEach((item) => element.appendChild(item))
  return element
}
