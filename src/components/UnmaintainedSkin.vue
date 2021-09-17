<template>
	<div class="unmaintained-skin">
		<img :src="dead" alt="unmaintained skin">
		<p>This skin appears to be <strong>unmaintained.</strong>
		</p>
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
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
		color: white;
		height: 100%;
		padding: 50px;
		text-align: center;
		text-transform: uppercase;
		flex-wrap: wrap;
		row-gap: 22px;

		> img {
			height: 120px;
			width: 120px;
			align-self: end;
		}

		> p {
			align-self: start;
			margin: 0;
			font-size: unit( (21 / 16), rem );
			width: 100%;

			strong {
				display: block;
				font-size: unit( (30 / 16), rem );
			}
		}
	}
</style>
