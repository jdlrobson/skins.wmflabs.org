<template>
	<div class="no-preview">
		<img :src="dead" alt="an emoji with crosses for eyes">
		<p><strong>This skin appears to be unmaintained.</strong></p>
		<p>
			If this is not true, please <a :href="url">review the skin's page</a>
			on MediaWiki.org for why.
			<pre>|status      = unmaintained &lt;!-- explanation --&gt; </pre>
			If you are the skin author, please address the problem described.
			If you are capable, you may want to fork this skin to fix this issue
			and update the download URL.
		</p>
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
