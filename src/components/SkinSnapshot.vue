<template>
  <div class="skin-snapshot">
    <h3>{{name}}</h3>
    <img src="{{src}}" />
  </div>
</template>

<script>
export default {
  name: 'SkinSnapshot',
  props: {
      name: {
          type: String,
          default: ''
      },
      src: {
          type: String,
          default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5/hPwAIAgL/4d1j8wAAAABJRU5ErkJggg=='
      }
  }
};
</script>

<style scoped>
</style>