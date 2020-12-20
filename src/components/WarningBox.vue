<template>
    <div class="warning">
         <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'WarningBox',
  components: {}
};
</script>

<style scoped>
.warning {
  padding: 20px;
  width: 100%;
  border: dashed 3px orange;
  margin-bottom: 20px;
}
a {
    font-weight: bold;
}
</style>