<template>
	<div class="preview-launcher">
		<div v-if="previewInactive"
			:class="previewScreenshotClass"
			@click="activatePreview"
		>
			<img :src="src">
			<no-preview v-if="!available">
				<p v-if="!available">
					Preview unavailable
				</p>
				<p v-if="!maintained">
					This skin appears to be <strong>unmaintained</strong>
				</p>
			</no-preview>
		</div>
		<preview v-else
			:href="href"
			:name="name"
			@changeArticle="changeArticle"></preview>
	</div>
</template>

<script>
import { HOST, TEST_ARTICLES, DEFAULT_SKIN_IMAGE } from '../constants';
import NoPreview from './NoPreview.vue';
import Preview from './Preview.vue';

export default {
	name: 'PreviewLauncher',
	components: {
		Preview,
		NoPreview
	},
	props: {
		maintained: {
			type: Boolean,
			required: true
		},
		available: {
			type: Boolean,
			required: true
		},
		skinkey: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		src: {
			type: String,
			default: DEFAULT_SKIN_IMAGE
		}
	},
	data() {
		return {
			testArticle: TEST_ARTICLES[ 0 ].title,
			previewInactive: true
		};
	},
	computed: {
		href() {
			return this.available ? `${HOST}/wiki/${this.testArticle}?useformat=desktop&useskin=${this.skinkey}` :
				undefined;
		},
		previewScreenshotClass() {
			return {
				screenshot: true,
				'screenshot--disabled': !this.available
			};
		}
	},
	methods: {
		activatePreview() {
			if ( this.available ) {
				this.previewInactive = false;
			}
		},
		changeArticle( a ) {
			this.testArticle = a;
		}
	}
};
</script>

<style scoped lang="less">
	.screenshot {
		position: relative;

		img {
			width: 100%;
			height: 440px;
			object-fit: cover;
			margin: auto;
		}

		&:after,
		.no-preview {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			opacity: 0.7;
		}

		&:after {
			border: solid 4px #000;
			background: #fff;
			content: 'Click to preview';
			color: #000;
			margin: 200px;
			text-align: center;
			height: 26px;
			opacity: 0.9;
		}

		&.screenshot--disabled {
			&:after {
				content: none;
			}
		}
	}
</style>
