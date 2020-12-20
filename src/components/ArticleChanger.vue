<template>
    <select @change="changeArticle">
        <option v-for="(a,i) in articles" :key="i" :value="a.title">{{ a.name }}</option>
    </select>
</template>

<script>
import { TEST_ARTICLES } from '../constants';

export default {
  name: 'ArticleChanger',
  data() {
      return {
          mobile: !!localStorage.getItem('mobile'),
          articles: TEST_ARTICLES,
          testArticle: TEST_ARTICLES[0]
      };
  },
  methods: {
    changeArticle: function ( ev ) {
      this.testArticle = ev.target.value;
      this.$emit('changeArticle', this.testArticle);
    }
  }
};
</script>

<style scoped>
</style>