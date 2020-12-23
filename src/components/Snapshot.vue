<template>
  <div :class="snapshotClass">
    <h3 v-if="displayTitle">
      <router-link :to="routerUrl">{{name}}</router-link>
      <abbr v-if="hasDependencies" title="Requires additional setup.">⚠️</abbr>
      <abbr v-if="experimental" title="Skin is marked as unmaintained or experimental.">⚠️</abbr>&nbsp;
      <abbr v-if="!compatible" title="Skin may not be compatible with MediaWiki 1.36.">⚠️</abbr>&nbsp;
    </h3>
    <img  width="320" height="200" :src="src" :alt="alt">
  </div>
</template>

<script>
import { DEFAULT_SKIN_IMAGE } from '../constants';

export default {
  name: 'Snapshot',
  computed: {
    snapshotClass() {
      return {
        'snapshot--unstable': !this.stable || !this.compatible,
        'snapshot--unmaintained': this.unmaintained,
        snapshot: true
      };
    },
    routerUrl() {
      return this.url ? this.url : ( this.skinkey ? `/skin/${this.skinkey}` : '' );
    },
    alt() {
      return `screenshot of ${this.name}`;
    }
  },
  props: {
    displayTitle: {
      type: Boolean,
      default: true
    },
    skinkey: {
        type: String,
        default: ''
    },
    unmaintained: {
      type: Boolean,
      default: false
    },
    compatible: {
      type: Boolean,
      default: true
    },
    experimental: {
      type: Boolean
    },
    hasDependencies: {
      type: Boolean
    },
    stable: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        default: '⠀'
    },
    url: {
        type: String
    },
    src: {
        type: String,
        default: DEFAULT_SKIN_IMAGE
    }
  }
};
</script>

<style scoped>
  .snapshot {
    width: 330px;
    color: #e80447;
    flex-shrink: 1;
    box-sizing: border-box;
    position: relative;
  }

  .snapshot--unmaintained:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
    height: 110px;
    background: url('../../assets/dead.png');
    background-size: 170px auto;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .snapshot--unmaintained img {
    opacity: 0.5;
  }
  h3 {
    background: white;
    padding: 12px;
    width: 320px;
    box-sizing: border-box;
    margin: 2px 0;
  }
  h3 a {
    width: 200px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }
  img {
    width: 320px;
    height: 200px;
    background: white;
    display: block;
    object-fit: cover;
  }
  a {
    color: #e80447;
  }
  footer {
    background: white;
    color: #333;
    font-size: 0.8em;
    width: 320px;
    padding: 10px 0;
    text-transform: uppercase;
  }
</style>