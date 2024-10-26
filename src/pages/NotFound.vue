<template>
	<Page class="page--404">
		<h2>Page not found</h2>
		<router-link class="breadcrumb" to="/">
			Explore other skins
		</router-link>
	</Page>
</template>

<script>
import { RouterLink } from 'vue-router';
import Page from './Page';

export default {
	name: 'NotFound',
	components: {
		RouterLink,
		Page
	}
};
</script>

<style scoped>
.page--404 {
	display: flex;
	align-items: center;
	min-height: 400px;
	flex-direction: column;
	justify-content: center;
}
</style>
