<template>
  <div class="snapshot">
    <h3 v-if="displayTitle">
      <router-link :to="routerUrl">{{name}}</router-link>
    </h3>
    <img width="320" height="200" :src="src" :alt="alt">
  </div>
</template>

<script>
export default {
  name: 'Snapshot',
  computed: {
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

  h3 {
    background: white;
    padding: 12px;
    width: 320px;
    box-sizing: border-box;
    margin: 2px auto;
  }

  a {
    color: #e80447;
  }
</style>