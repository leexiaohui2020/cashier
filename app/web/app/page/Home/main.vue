<template>
  <div>
    <router-link to="/instance">控制台</router-link>
  </div>
</template>

<script>
export default {
  name: 'PageHome',
  installRouter(router) {
    router.regist('home', '/', this, {
      auth: true,
      title: '首页'
    })
  }
}
</script>
