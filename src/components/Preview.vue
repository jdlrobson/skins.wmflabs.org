<template>
    <div class="preview">
        <h3>Preview of {{ name }}</h3>
        <div class="preview__panel">
          <slot></slot>
          <input type="checkbox" name="mobile" :checked="mobile" @input="toggleMobile">
          <label for="mobile">mobile</label>
        </div>
        <div v-if="enabled" class="preview__area">
          <iframe :class="iframeClass" ref="iframe" :src="href" :width="w" :height="h" />
        </div>
        <div v-else class="preview__area preview__area--unavailable">
          Preview unavailable.
        </div>
        <warning-box v-if="!enabled">
          If you are the maintainer of the skin you can request preview is enabled
          by creating an <a target="_blank"
            :href="createIssue">issue</a>.
        </warning-box>
    </div>
</template>

<script>
import { HOST, TEST_ARTICLE } from '../constants';
import WarningBox from '../components/WarningBox';
import mustache from 'mustache';

export default {
  name: 'Preview',
  components: {
    WarningBox
  },
  props: {
    name: {
      type: String,
      default: 'Skin'
    },
    html: {
      type: String
    },
    href: {
      type: String
    }
  },
  data() {
      return {
          mobile: !!localStorage.getItem('mobile')
      };
  },
  computed: {
    createIssue() {
      return `https://github.com/jdlrobson/skins.wmflabs.org/issues/new?assignees=&labels=&template=enable-preview-for-${this.name}-on-skins-wmflabs-org.md&title=Please+enable+my+skin+for+live+preview+option`;
    },
    iframeClass() {
      return this.mobile ? 'iframe--mobile' : 'iframe--desktop';
    },
    w() {
      return this.mobile ? 375 : 640;
    },
    h() {
      return this.mobile ? 240 : 480;
    },
    enabled() {
      return this.href || this.html;
    }
  },
  methods: {
    toggleMobile: function ( ev ) {
      this.mobile = ev.target.checked;
      if(this.mobile) {
        localStorage.setItem('mobile', this.mobile);
      } else {
        localStorage.removeItem('mobile');
      }
    },
    refresh() {
      const iframe = this.$refs.iframe;
      const html = this.html;
      if(iframe && html) {
        
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
  },
  mounted() {
    this.refresh();
  },
  updated() {
    this.refresh();
  }
};
</script>

<style scoped>
  .preview__area {
    overflow: hidden;
    width: 640px;
    text-align: center;
  }
  iframe {
    margin: auto;
    background: white;
    display: block;
  }
  .iframe--desktop {
    width: calc( 640px / 0.5 );
    height: calc( 480px / 0.5 );
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
  }
  .iframe--mobile {
    width: 375px;
    height: 667px;
  }
  .preview__panel {
    padding: 8px;
    width: 640px;
    background: #000;
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