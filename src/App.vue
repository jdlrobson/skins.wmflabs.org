<template>
  <div class="container">
    <nav>
      <router-link to="/">
        Explore
      </router-link>
      <router-link to="/add">
        create
      </router-link>
    </nav>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <p>
        Made by <a href="https://jdlrobson.com">Jon Robson</a>.
        Code on <a href="https://github.com/jdlrobson/skins.wmflabs.org">github.com</a>.
        Sourced images: <a title="License, as on date of upload: ‘Creative Commons Attribution license (reuse allowed)’  , CC BY 3.0 &lt;https://creativecommons.org/licenses/by/3.0&gt;, via Wikimedia Commons"
        href="https://commons.wikimedia.org/wiki/File:Supernova_(CGI).jpg">File:Supernova_(CGI).jpg</a>
        </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
  main {
    margin: 12px 0;
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
  footer {
    margin-top: 40px;
    font-size: 0.8em;
  }
</style>