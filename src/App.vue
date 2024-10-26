<template>
	<RouterView class="container"></RouterView>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
	name: 'App',
	components: {
		RouterView
	}
};
</script>

<style lang="less" scoped>
	main {
		height: 100%;
	}
	nav {
		display: block;
		border: solid 1px white;
		border-left: none;
		border-right: none;
		padding: 20px 0;
	}
	nav a {
		padding: 0 8px;
		text-decoration: none;
		text-transform: lowercase;
	}
</style>
