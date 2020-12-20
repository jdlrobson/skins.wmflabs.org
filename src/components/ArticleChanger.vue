<template>
    <span>
        <label for="article-title">article: </label>
        <select name="article-title" @change="changeArticle">
            <option v-for="(a,i) in articles" :key="i" :value="a.title">{{ a.name }}</option>
        </select>
    </span>
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