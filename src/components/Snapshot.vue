<template>
  <div :class="snapshotClass">
    <h3 v-if="displayTitle">
      <router-link :to="routerUrl">{{name}}</router-link>
    </h3>
    <img  width="320" height="200" :src="src" :alt="alt">
    <footer>
      <span v-if="hasDependencies">⚠️ Requires additional setup.</span>
      <span v-if="!compatible">⚠️ Skin is not compatible with MediaWiki 1.36.</span>
      &nbsp;
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Snapshot',
  computed: {
    snapshotClass() {
      return this.stable && this.compatible ? 'snapshot' : 'snapshot snapshot--unstable';
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
    compatible: {
      type: Boolean,
      default: true
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
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5/hPwAIAgL/4d1j8wAAAABJRU5ErkJggg=='
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
  }
  .snapshot--unstable {
    opacity: 0.5;
  }
  h3 {
    background: white;
    padding: 12px;
    width: 320px;
    box-sizing: border-box;
    margin: 2px 0;
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