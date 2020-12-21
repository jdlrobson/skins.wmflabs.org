<template>
  <div class="page--new">
    <h2>Create a new skin</h2>
    <two-column-layout>
      <template v-slot:column-one>
        <h3>HTML ( Mustache )</h3>
        <textarea @input="updateMustache" :value="mustache"></textarea>
        <h3>CSS</h3>
        <textarea @input="updateCSS" :value="css"></textarea>
        <h3>Name and download</h3>
        <input type="text" @input="updateName" placeholder="Skin's name" :value="skinname">
        <button @click="download" :disabled="skinname === ''">Download as ZIP</button>
      </template>
      <template v-slot:column-two>
       <preview :html="html" :name="skinname">
          <article-changer @changeArticle="changeArticle"></article-changer>
       </preview>
      </template>
    </two-column-layout>
  </div>
</template>

<script>
import { PARTIALS, DEFAULT_SKIN_MUSTACHE, DEFAULT_SKIN_CSS } from '../starter-template';
import api from '../api.js';
import build from '../export/index.js';
import { TEST_ARTICLES } from '../constants';
import { render } from 'mustache';
import Preview from '../components/Preview.vue';
import ArticleChanger from '../components/ArticleChanger';
import TwoColumnLayout from '../components/TwoColumnLayout.vue';

const DEFAULT_HTML = '<!DOCTYPE HTML><html><body>Loading preview...</body></html>';

export default {
  name: 'Add',
  components: {
    Preview,
    ArticleChanger,
    TwoColumnLayout
  },
  data() {
    return {
      skinname: localStorage.getItem('name') || null,
      templateDataReq: {},
      pending: null,
      title: TEST_ARTICLES[0].title,
      html: DEFAULT_HTML,
      css: DEFAULT_SKIN_CSS,
      mustache: DEFAULT_SKIN_MUSTACHE
    }
  },
  mounted() {
    this.generatePreview();
  },
  methods: {
    updateName(ev) {
      this.skinname = ev.target.value;
      localStorage.setItem('name', this.skinname);
    },
    download() {
      build(
        this.skinname,
        {
          'skin.css': this.css,
        },
        Object.assign( {
          'skin': this.mustache,
        }, PARTIALS ),
        {
          'skin.js': '// scripts can go here'
        }
      );
    },
    changeArticle(title) {
      this.title = title;
      this.generatePreview();
    },
    updateCSS(ev) {
      this.css = ev.target.value;
      this.generatePreview();
    },
    updateMustache(ev) {
      this.mustache = ev.target.value;
      this.generatePreview();
    },
    getUrl(title) {
      return `https://skins-demo.wmflabs.org/wiki/${title}?useskin=skinjson`
    },
    getTemplateData(title) {
      if(!this.templateDataReq[title]) {
        this.templateDataReq[title] = fetch( this.getUrl(title),
            {
              mode: 'cors'
            } )
            .then((r) => r.json())
      }
      return this.templateDataReq[title];
    },
    generatePreview() {
      if ( this.pending ) {
        clearTimeout(this.pending);
      }
      this.html = DEFAULT_HTML;
      this.pending = setTimeout(() => {
        this.getTemplateData(this.title).then((data) => {
          const OVERRIDES = {
            'msg-sitetitle': 'Skinomatic@skins.wmflabs.org',
            'msg-tagline': 'Presented to you in the skinomatic 4000',
            'html-subtitle': `<a target="_blank" href="${this.getUrl(this.title)}">View as JSON format</a>.`
          };
          this.html = `<!DOCTYPE HTML>
                <html>
                <head>
                  <link rel="stylesheet" href="https://skins-demo.wmflabs.org/w/load.php?modules=skins.skinjson&only=styles">
                  <style type="text/css">${this.css}</style>
                </head>
                <body>${render(this.mustache, Object.assign( {}, data, OVERRIDES), PARTIALS)}</body></html>`;
        })
      }, 300 );
    }
  }
}
</script>

<style scoped>
textarea {
  width: 320px;
  height: 200px;
}

input {
  width: 320px;
  height: 40px;
}

button:disabled {
  opacity: 0.5;
}

button {
  color: #fff;
  background-color: #36c;
  border-color: #36c;
  padding-top: 5px;
  padding-bottom: 5px;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
  min-height: 32px;
  border-radius: 2px;
  font-weight: bold;
  text-decoration: none;
  vertical-align: top;
  text-align: center;
  font-size: 16px;
  line-height: 1;
  box-sizing: border-box;
  margin-top: 20px;
}
</style>