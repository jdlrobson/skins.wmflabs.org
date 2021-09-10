<template>
	<div class="unmaintained-skin">
		<img :src="dead" alt="an emoji with crosses for eyes">
		<p><strong>This skin appears to be unmaintained.</strong></p>
	</div>
</template>

<script>
import dead from './assets/unmaintained.svg';

export default {
	name: 'NoPreviewAvailable',
	props: {
		url: {
			type: String,
			required: true
		}
	},
	computed: {
		dead() {
			return dead;
		}
	}
};
</script>

<style lang="less" scoped>
	.unmaintained-skin {
		background: #000;
		color: white;
		display: flex;
		align-items: center;
		height: 100%;
		align-content: center;
		flex-wrap: wrap;
		padding: 50px;

		> p {
			flex-grow: 1;
		}

		> img {
			height: 200px;
			width: 200px;
		}
	}
</style>
