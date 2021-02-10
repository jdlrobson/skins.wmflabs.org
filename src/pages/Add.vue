<template>
  <div class="page--new">
    <h2>Create a new skin</h2>
    <two-column-layout>
      <template v-slot:column-one>
        <h3>HTML ( Mustache )</h3>
        <textarea @input="updateMustache" :value="mustache"></textarea>
        <h3>CSS / LESS</h3>
        <textarea @input="updateCSS" :value="less"></textarea>
        <h3>Name and download</h3>
        <input type="text" @input="updateName" placeholder="Skin's name" :value="skinname">
        <button @click="download" :disabled="skinname === ''">Download as ZIP</button>
        <button @click="reset">Reset</button>
      </template>
      <template v-slot:column-two>
       <preview :html="html" :name="skinname">
          <article-changer @changeArticle="changeArticle"></article-changer>
          <input type="checkbox" :checked="anon" @input="changeAnon">Anonymous
       </preview>
      <div class="data-explorer">
        <h2>Template data</h2>
        <p>Explore the data you can render in your skin here.</p>
        <json-viewer :value="json" :boxed="true" :expanded="false"
          :sort="true"
          :copyable="true"></json-viewer>
      </div>
      </template>
    </two-column-layout>
  </div>
</template>

<script>
/* global less */
import { PARTIALS, DEFAULT_SKIN_MUSTACHE, generateStylesheetLESS, SCRIPTS, messages } from '../starter-template';
import api from '../api.js';
import build from '../export/index.js';
import { TEST_ARTICLES, HOST, LESS_RENDER_OPTIONS } from '../constants';
import { render } from 'mustache';
import Preview from '../components/Preview.vue';
import ArticleChanger from '../components/ArticleChanger';
import TwoColumnLayout from '../components/TwoColumnLayout.vue';
import nameMe from '../nameMe';
import JsonViewer from 'vue-json-viewer'

const DEFAULT_HTML = '<!DOCTYPE HTML><html><body>Loading preview...</body></html>';

const DEFAULT_SKIN_PROPS = {
  html: DEFAULT_HTML,
  anon: true,
  less: generateStylesheetLESS(),
  mustache: DEFAULT_SKIN_MUSTACHE,
  skinname: ''
};

function getCached() {
  const props = {};
  Object.keys((DEFAULT_SKIN_PROPS)).forEach((key) => {
    let val = localStorage.getItem(`add-${key}`);
    if(val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    }
    props[key] = val !== null ? val : DEFAULT_SKIN_PROPS[key];
  });
  if(!props.skinname) {
    props.skinname = nameMe();
  }
  return props;
}

export default {
  name: 'Add',
  components: {
    JsonViewer,
    Preview,
    ArticleChanger,
    TwoColumnLayout
  },
  data() {
    return Object.assign( getCached(), {
      templateDataReq: {},
      pending: null,
      startingLess: DEFAULT_SKIN_PROPS.less,
      json: '',
      css: '', // will be derived from less data value.
      title: TEST_ARTICLES[0].title,
    } )
  },
  mounted() {
    this.generatePreview();
    this.updateJSON();
  },
  methods: {
    updateJSON() {
      api.getSkinJSON(this.title, this.anon).then((json) => {
        this.json = json;
      });
    },
    changeAnon(ev) {
      this.anon = ev.target.checked;
      localStorage.setItem('add-anon', this.anon);
      this.generatePreview();
      this.updateJSON();
    },
    reset() {
      const noConfirmationNeeded = DEFAULT_SKIN_PROPS.mustache === this.mustache
        && this.startingLess === this.less;

      const confirm = noConfirmationNeeded || window.confirm(`Reset the skin (${this.skinname}) you are currently working on? All changes will be lost!`)
      if(confirm) {
        Object.keys(DEFAULT_SKIN_PROPS).forEach((key) => {
          localStorage.removeItem(`add-${key}`);
          this[key] = DEFAULT_SKIN_PROPS[key];
        });
        this.skinname = nameMe();
        // random stylesheet each time.
        this.less = generateStylesheetLESS();
        this.startingLess = this.less;
        localStorage.setItem('add-skinname', this.skinname);
        this.generatePreview();
      }
    },
    updateName(ev) {
      this.skinname = ev.target.value;
      localStorage.setItem('add-skinname', this.skinname);
    },
    download() {
      build(
        this.skinname,
        {
          'skin.less': `@import 'mediawiki.skin.variables.less';
${this.less}`,
        },
        Object.assign( {
          'skin': this.mustache,
        }, PARTIALS ),
        {
          'skin.js': `/* scripts can go here */
`
        },
        messages()
      );
    },
    changeArticle(title) {
      this.title = title;
      this.generatePreview();
      this.updateJSON();
    },
    updateCSS(ev) {
      this.less = ev.target.value;
      this.generatePreview();
      localStorage.setItem('add-less', this.less);
    },
    updateMustache(ev) {
      this.mustache = ev.target.value;
      this.generatePreview();
      localStorage.setItem('add-mustache', this.mustache);
    },
    getUrl(title) {
      return `${HOST}/wiki/${title}?useskin=skinjson&testuser=${this.anon ? '0': '1'}`
    },
    getTemplateData(title) {
      const url = this.getUrl(title);
      if(!this.templateDataReq[url]) {
        this.templateDataReq[url] = fetch( url,
            {
              mode: 'cors'
            } )
            .then((r) => r.json())
      }
      return this.templateDataReq[url];
    },
    generatePreview() {
      if ( this.pending ) {
        clearTimeout(this.pending);
      }
      this.html = DEFAULT_HTML;
      this.pending = setTimeout(() => {
        let css;
        less.render(this.less, LESS_RENDER_OPTIONS).then((compiledLess) => {
          css = compiledLess.css;
          return this.getTemplateData(this.title);
        }, (err) => {
          css = '';
          console.log(`Error in LESS:\n ${err.message}`, err);
          return this.getTemplateData(this.title);
        }).then((data) => {
          const OVERRIDES = {
            'msg-sitetitle': 'Skinomatic 4000',
            'msg-tagline': 'Presented to you in the skinomatic 4000',
            'html-subtitle': `<a target="_blank" href="${this.getUrl(this.title)}">View as JSON format</a>.`
          };
          this.html = `<!DOCTYPE HTML>
                <html>
                <head>
                  <link rel="stylesheet" href="${HOST}/w/load.php?modules=site.styles|skins.skinjson&only=styles" />
                  <link rel="stylesheet" href="${HOST}/w/load.php?lang=en&modules=ext.cite.styles%7Cext.echo.styles.badge%7Cext.math.styles%7Cext.wikihiero%7Cmediawiki.page.gallery.styles%7Cmediawiki.ui.icon%7Coojs-ui.styles.icons-alerts&only=styles">
                  <style type="text/css">${css}</style>
                </head>
                <body>${render(this.mustache, Object.assign( {}, data, OVERRIDES), PARTIALS)}
                ${SCRIPTS}
                </body></html>`;
        })
      }, 300 );
    }
  }
}
</script>

<style scoped>
textarea {
  width: 320px;
  height: 400px;
}

input[type=text] {
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

.data-explorer {
  width: 100%;
  height: 400px;
  text-align: left;
}

@media (min-width: 1920px) {
  textarea {
    width: 1300px;
  }
}
</style>