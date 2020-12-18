<template>
  <div class="container">
    <header>
      <router-link to="/">
        <h1>Skins lab</h1>
      </router-link>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
  .container {
    width: 800px;
    margin: 2px auto;
    text-align: center;
  }

  header {
    background: yellow;
    padding: 8px;
    margin: 0;
  }

  header h1 {
    text-transform: uppercase;
  }

  header a {
    text-decoration: none;
    color: purple;
  }

  main {
    margin: 12px 0;
  }
</style>