<template>
	<div class="no-preview">
		<img :src="dead" alt="an emoji with crosses for eyes">
		<p><strong>This skin appears to be unmaintained.</strong></p>
	</div>
</template>

<script>
import dead from '../../assets/dead.png';

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
	.no-preview {
		display: flex;
		align-items: center;
		height: 100%;
		align-content: center;
		flex-wrap: wrap;

		> p {
			flex-grow: 1;
		}

		> img {
			height: 200px;
			width: 200px;
		}
	}
</style>
