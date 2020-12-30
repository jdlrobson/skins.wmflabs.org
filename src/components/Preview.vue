<template>
    <div class="preview">
        <h3>Preview of {{ name }}</h3>
        <div class="preview__panel">
          <slot></slot>
          <select @change="changeMedium">
            <option value="d">desktop</option>
            <option value="t">tablet</option>
            <option value="m">mobile</option>
          </select>
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
          medium: !!localStorage.getItem('medium')
      };
  },
  computed: {
    createIssue() {
      return `https://github.com/jdlrobson/skins.wmflabs.org/issues/new?assignees=&labels=&template=enable-preview-for-${this.name}-on-skins-wmflabs-org.md&title=Please+enable+my+skin+for+live+preview+option`;
    },
    iframeClass() {
      switch( this.medium ) {
        case 'm':
          return 'iframe--mobile';
        case 't':
          return 'iframe--tablet';
        default:
          return 'iframe--desktop';
      }
    },
    w() {
      switch( this.medium ) {
        case 'm':
          return 375;
        // Following have a 0.5 scale transform
        case 't':
          return 768;
        default:
          return 1280;
      }
    },
    h() {
      switch( this.medium ) {
        case 'm':
          return 240;
        // Following have a 0.5 scale transform
        case 't':
          return 1024;
        default:
          return 960;
      }
    },
    enabled() {
      return this.href || this.html;
    }
  },
  methods: {
    changeMedium: function ( ev ) {
      const medium = ev.target.value;
      this.medium = medium;
      localStorage.setItem('medium', medium);
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
    --preview-width: 640px;
    overflow: hidden;
    width: var(--preview-width);
    text-align: center;
  }
  iframe {
    margin: auto;
    background: white;
    display: block;
  }
  .iframe--tablet,
  .iframe--desktop {
    transform-origin: 0 0;
  }

  .iframe--desktop {
    transform: scale(0.35, 0.35); /* 0.35= 640px / 1800px */
    width: 1800px;
    height: 650px;
  }
  .iframe--tablet {
    transform: scale(0.83, 0.83); /* 0.83= 640px / 768px*/
    width: 768px;
    height: 1024px;
  }
  .iframe--mobile {
    width: 375px;
    height: 667px;
  }
  .preview__panel {
    --preview-width: 640px;
    padding: 8px;
    width: var(--preview-width);
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