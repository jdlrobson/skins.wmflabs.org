<template>
  <div class="page--skin">
    <h2>Skin: {{name}}</h2>
    <router-link class="breadcrumb" to="/">
      Explore other skins
    </router-link>
    <two-column-layout>
       <template v-slot:column-one>
        <h3>About</h3>
        <warning-box class="warningbox" v-if="!stable || !preview">
          <span v-if="!stable">Warning: This skin is not marked as stable.</span>
          <span v-if="!preview">Warning: This skin may require additional setup and/or may
            not be compatible with MediaWiki 1.36.</span>
        </warning-box>
        <snapshot :stable="stable" :compatible="preview"
          :display-title="false" :name="name" :src="src"></snapshot>
        <p>{{summary}}</p>
        <a class="skinLink" v-for="(link,i) in links" target="_blank" :key="i"
          :href="link.href">{{ link.text}}</a>
      </template>
      <template v-slot:column-two>
        <preview :href="href">
          <article-changer @changeArticle="changeArticle"></article-changer>
        </preview>
      </template>
    </two-column-layout>
  </div>
</template>

<script>
import api from '../api.js';
import TwoColumnLayout from '../components/TwoColumnLayout';
import Snapshot from '../components/Snapshot.vue';
import Preview from '../components/Preview.vue';
import WarningBox from '../components/WarningBox.vue';
import ArticleChanger from '../components/ArticleChanger';
import { HOST, TEST_ARTICLE } from '../constants';

export default {
  name: 'Skin',
  components: {
      ArticleChanger,
      Snapshot,
      Preview,
      WarningBox,
      TwoColumnLayout
  },
  data() {
      return {
          stable: true,
          testArticle: TEST_ARTICLE,
          preview: true,
          skinkey: this.$route.params.key,
          name: this.$route.params.key.replace( /[^⠀]/g, '⠀' ) + '⠀',
          links: [],
          summary: '',
          src: ''
      };
  },
  computed: {
    mwUrl() {
      return this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : '';
    },
    href() {
      return this.stable && this.preview ? `${HOST}/wiki/${this.testArticle}?useskin=${this.skinkey}`
        : undefined
    }
  },
  methods: {
    changeArticle(a) {
      this.testArticle = a;
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
          if(skin.kde) {
            links.push( {
              text: 'View on kde',
              href: skin.kde
            } )
          }
      },() => {
        this.$router.replace({ path: '/404' });
      });
  }
};
</script>

<style scoped>
  .warningbox,
  p {
    width: 320px;
  }
  .skinLink {
    display: block;
    margin-bottom: 10px;
    width: 320px;
  }
</style>