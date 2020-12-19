<template>
  <div class="page--home">
    <h2>Add skin</h2>
    <p>Currently this is a manual process. In future I hope this to be a case
        of automatically discovering skins on codesearch.wmflabs.org</p>
    <p>In the mean time you must edit this <a href="https://skins.wmflabs.org/wiki/MediaWiki:Skins">wiki page</a> and add it
    to the <a href="https://skins.wmflabs.orgs">the skins vagrant setup</a>.</p>

    <router-link to="/">
      Explore other skins
    </router-link>
  </div>
</template>

<script>
import api from '../api.js';
import Snapshot from '../components/Snapshot.vue';

export default {
  name: 'Add',
  components: {}
}
</script>
