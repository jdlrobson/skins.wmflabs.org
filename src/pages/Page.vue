<template>
	<main class="page">
		<slot></slot>
	</main>
</template>
<style lang="less" scoped>
@import '../variables.less';

.page {
	box-sizing: content-box;
	padding: 0;
	width: 1000px;
	color: white;
	margin: auto;
	text-align: center;
}
</style>
<script>
export default {
	name: 'Page'
};
</script>
