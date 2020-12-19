<template>
  <div class="page--skin">
    <h2>Skin: {{name}}</h2>
    <router-link class="breadcrumb" to="/">
      Explore other skins
    </router-link>
    <article>
      <div>
        <h3>About</h3>
        <snapshot :display-title="false" :name="name" :src="src"></snapshot>
        <a target="_blank" :href="mwUrl">View on mediawiki.org</a>
      </div>
      <aside>
        <h3>Preview</h3>
        <iframe :src="demoLink" width="640" height="480">
      </aside>
    </article>
    </iframe>
  </div>
</template>

<script>
import { HOST, TEST_ARTICLE } from '../constants';
import api from '../api.js';
import Snapshot from '../components/Snapshot.vue';

export default {
  name: 'Skin',
  components: {
      Snapshot
  },
  data() {
      return {
          name: '_____',
          src: ''
      };
  },
  computed: {
    mwUrl() {
      return this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : '';
    },
    demoLink() {
      return `${HOST}/wiki/${TEST_ARTICLE}?useskin=${this.$route.params.key}`;
    }
  },
  mounted: function() {
      api.fetchSkinInfo(  this.$route.params.key ).then((skin) => {
          this.name = skin.name;
          this.src = skin.src;
      });
  }
};
</script>

<style scoped>
  article {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-flow: row wrap;
  }
  aside {
    width: 640px;
  }
  iframe {
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
    width: calc( 640px / 0.5 );
    height: calc( 480px / 0.5 );
  }
</style>