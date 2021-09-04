<template>
	<span class="article-changer">
		<label for="article-title">article: </label>
		<custom-select>
			<select name="article-title" @change="changeArticle">
				<option v-for="(a,i) in articles"
					:key="i"
					:value="a.title">{{ a.name }}</option>
			</select>
		</custom-select>
	</span>
</template>

<script>
import { TEST_ARTICLES } from '../constants';
import CustomSelect from './CustomSelect.vue';

export default {
	name: 'ArticleChanger',
	components: {
		CustomSelect
	},
	data() {
		return {
			mobile: !!localStorage.getItem( 'mobile' ),
			articles: TEST_ARTICLES,
			testArticle: TEST_ARTICLES[ 0 ]
		};
	},
	methods: {
		changeArticle: function ( ev ) {
			this.testArticle = ev.target.value;
			this.$emit( 'changeArticle', this.testArticle );
		}
	}
};
</script>

<style scoped>
</style>
