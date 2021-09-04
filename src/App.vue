<template>
	<router-view class="container"></router-view>
</template>

<script>
export default {
	name: 'App'
};
</script>

<style lang="less" scoped>
  main {
	  height: 100%;
  }
  nav {
    display: block;
    border: solid 1px white;
    border-left: none;
    border-right: none;
    padding: 20px 0;
  }
  nav a {
    padding: 0 8px;
    text-decoration: none;
    text-transform: lowercase;
  }
</style>
