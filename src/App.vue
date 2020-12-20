<template>
  <div class="container">
    <header>
      <router-link to="/">
        <h1>MediaWiki skins</h1>
      </router-link>
        <span>A place to find the perfect skin for your mediawiki.</span>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <p>
        Made by <a href="https://jdlrobson.com">Jon Robson</a>.
        Code on <a href="">github.com</a>.
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
  .container {
    width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  header {
    padding: 8px;
    margin: 0;
  }

  header span {
    font-size: 0.8em;
  }

  header h1 {
    text-transform: uppercase;
    margin-bottom: 0;
  }

  header a {
    text-decoration: none;
    color:yellow;
  }

  main {
    margin: 12px 0;
  }
  footer {
    margin-top: 40px;
    font-size: 0.8em;
  }
</style>