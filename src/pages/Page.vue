<template>
	<main class="page">
		<slot></slot>
	</main>
</template>

<script>
export default {
	name: 'Page'
};
</script>

<style lang="less" scoped>
@import '../variables.less';

.page {
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	padding: 50px 10px;
	color: black;
	margin: auto;
	text-align: left;

	@media (min-width: 600px) {
		padding: 50px 20px 50px 60px;

		> * {
			padding-right: 40px;
			max-height: 100%;
		}
	}
}
</style>
