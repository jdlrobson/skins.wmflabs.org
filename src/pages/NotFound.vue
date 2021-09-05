<template>
	<page class="page--404">
		<h2>Page not found</h2>
		<router-link class="breadcrumb" to="/">
			Explore other skins
		</router-link>
	</page>
</template>

<script>
import Page from './Page';

export default {
	name: 'NotFound',
	components: {
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
