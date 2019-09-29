<template>
  <LeeLayout active="home">
  </LeeLayout>
</template>

<script>
export default {
  name: 'PageHome',
  installRouter(router) {
    router.regist('home', '/', this, {
      title: '首页'
    })
  }
}
</script>
