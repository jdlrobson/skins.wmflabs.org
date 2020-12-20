<template>
    <div class="preview">
        <h3>Preview</h3>
        <select v-if="enabled" @change="changeArticle">
            <option v-for="(a,i) in articles" :key="i" :value="a.title">{{ a.name }}</option>
          </select>
        <div v-if="enabled" class="preview-area">
          <iframe ref="iframe" :src="demoLink" width="640" height="480" />
        </div>
        <div v-else class="preview__area preview__area--unavailable">
          Preview unavailable.
        </div>
        <warning-box v-if="!enabled">
          If you are the maintainer of the skin you can request preview is enabled
          by creating an <a target="_blank"
            href="https://github.com/jdlrobson/skins.wmflabs.org/issues/new?assignees=&labels=&template=enable-preview-for-my-skin-on-skins-wmflabs-org.md&title=Please+enable+my+skin+for+live+preview+option">issue</a>.
        </warning-box>
    </div>
</template>

<script>
import { HOST, TEST_ARTICLE } from '../constants';
import WarningBox from '../components/WarningBox';

export default {
  name: 'Preview',
  components: {
    WarningBox
  },
  props: {
    html: {
      type: String
    },
    skinkey: {
      type: String
    }
  },
  data() {
      return {
          articles: [
            { title: TEST_ARTICLE, name: TEST_ARTICLE.replace(/_/g, ' ') },
            { title: 'Rube Goldberg machine', name: 'Rube Goldberg machine' }
          ],
          testArticle: TEST_ARTICLE
      };
  },
  computed: {
    enabled() {
      return this.skinkey || this.html;
    },
    demoLink() {
      console.log('hello', this.skinkey);
      return this.skinkey ? `${HOST}/wiki/${this.testArticle}?useskin=${this.skinkey}` : undefined;
    }
  },
  methods: {
    changeArticle: function ( ev ) {
      this.testArticle = ev.target.value;
    }
  },
  mounted() {
      const iframe = this.$refs.iframe;
      const html = this.html;
      if(iframe && html) {
        console.log('gop', html);
          let doc;
          if (iframe.contentDocument) {
              doc = iframe.contentDocument;
          } else if(iframe.contentWindow) {
              doc = iframe.contentWindow.document;
          } else {
              doc = iframe.document;
          }
          doc.open('');
          doc.writeln(html);
          doc.close();
      }
  }
};
</script>

<style scoped>
  .preview__area {
    overflow: hidden;
  }
  iframe {
    background: white;
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
    width: calc( 640px / 0.5 );
    height: calc( 480px / 0.5 );
  }
  .preview__area--unavailable {
    opacity: 0.5;
    background: gray;
    width: 640px;
    height: 480px;
    position: relative;
    padding-top: 260px;
  }
  .preview__area--unavailable:after {
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
</style>