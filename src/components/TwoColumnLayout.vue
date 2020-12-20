<template>
  <div class="page--skin">
    <article>
      <aside>
        <slot name="column-one"></slot>
      </aside>
      <aside>
        <slot name="column-two"></slot>
      </aside>
    </article>
  </div>
</template>

<script>
export default {
  name: 'TwoColumnLayout',
  components: {}
};
</script>

<style scoped>
  article {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-flow: row wrap;
  }
  aside {
    width: 360px;
  }
  aside > * {
    margin-left: auto;
    margin-right: auto;
  }
  aside + aside {
    margin-left: 10px;
    width: 630px;
  }
</style>