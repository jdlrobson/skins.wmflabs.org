<template>
  <div class="page--skin">
    <h2>Skin: {{name}}</h2>
    <router-link class="breadcrumb" to="/">
      Explore other skins
    </router-link>
    <article>
      <aside>
        <h3>About</h3>
        <div class="warning" v-if="!stable || !preview">
          <span v-if="!stable">Warning: This skin is not marked as stable.</span>
          <span v-if="!preview">Warning: This skin may require additional setup and/or may
            not be compatible with MediaWiki 1.36.</span>
        </div>
        <snapshot :stable="stable" :compatible="preview"
          :display-title="false" :name="name" :src="src"></snapshot>
        <p>{{summary}}</p>
        <a class="skinLink" v-for="(link,i) in links" target="_blank" :key="i"
          :href="link.href">{{ link.text}}</a>
      </aside>
      <aside>
        <h3>Preview</h3>
        <select  v-if="stable && preview" @change="changeArticle">
            <option v-for="(a,i) in articles" :key="i" :value="a.title">{{ a.name }}</option>
          </select>
        <div v-if="stable && preview" class="preview-area">
          <iframe :src="demoLink" width="640" height="480" />
        </div>
        <div v-else class="preview-area preview-area--unavailable">
          Preview unavailable.
        </div>
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
          articles: [
            { title: TEST_ARTICLE, name: TEST_ARTICLE.replace(/_/g, ' ') },
            { title: 'Rube Goldberg machine', name: 'Rube Goldberg machine' }
          ],
          testArticle: TEST_ARTICLE,
          stable: true,
          preview: true,
          name: '_____',
          links: [],
          summary: '',
          src: ''
      };
  },
  computed: {
    mwUrl() {
      return this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : '';
    },
    demoLink() {
      return `${HOST}/wiki/${this.testArticle}?useskin=${this.$route.params.key}`;
    }
  },
  methods: {
    changeArticle: function ( ev ) {
      this.testArticle = ev.target.value;
    }
  },
  mounted: function() {
      api.fetchSkinInfo(  this.$route.params.key ).then((skin) => {
        console.log('got', skin)
          this.name = skin.name;
          this.src = skin.src;
          this.summary = skin.summary;
          this.stable = skin.stable;
          this.preview = !skin.hasDependencies && skin.compatible;
          const links = [];
          links.push(
            {
              text: 'View on mediawiki.org',
              href: this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : ''
            }
          );
          this.links = links;
          if(skin.github) {
            links.push( {
              text: 'View on github.com',
              href: skin.github
            } )
          }
          if(skin.bitbucket) {
            links.push( {
              text: 'View on bitbucket',
              href: skin.bitbucket
            } )
          }
          if(skin.gitlab) {
            links.push( {
              text: 'View on gitlab',
              href: skin.gitlab
            } )
          }
          if(skin.gerrit) {
            links.push( {
              text: 'View on gerrit',
              href: skin.gerrit
            } )
          }
      },() => {
        this.$router.replace({ path: '/404' });
      });
  }
};
</script>

<style scoped>
  .warning {
    padding: 20px;
    width: 320px;
    border: dashed 3px orange;
    margin-bottom: 20px;
  }
  article {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-flow: row wrap;
  }
  aside {
    width: 360px;
  }
  aside > * {
    margin-left: auto;
    margin-right: auto;
  }
  aside + aside {
    width: 640px;
  }
  .preview-area {
    overflow: hidden;
  }
  iframe {
    background: white;
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
    width: calc( 640px / 0.5 );
    height: calc( 480px / 0.5 );
  }
  .preview-area--unavailable {
    opacity: 0.5;
    background: gray;
    width: 640px;
    height: 480px;
    position: relative;
    padding-top: 260px;
  }
  .preview-area--unavailable:after {
    position: absolute;
    top: calc( 220px - 50px);
    bottom: 0;
    left: 0;
    right: 0;
    content: "\274c";
    font-size: 50px;
    color: #FFF;
    line-height: 100px;
    text-align: center;
  }
  aside p {
    width: 320px;
  }
  .skinLink {
    display: block;
    margin-bottom: 10px;
    width: 320px;
  }
</style>