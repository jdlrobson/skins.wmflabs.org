<template>
	<div :class="snapshotClass">
		<router-link :to="routerUrl">
			<h3 v-if="displayTitle">
				<span>{{ name }}</span>
				<abbr v-if="hasDependencies" title="Requires additional setup.">⚙️</abbr>
				<abbr v-if="beta" title="Skin is marked as beta.">β</abbr>
				<abbr v-if="experimental" title="Skin is marked as experimental.">🧪</abbr>
				<abbr v-if="mightBreak" title="Might break in future MediaWiki versions">⚡</abbr>
				<abbr v-if="!compatible" title="No preview available.">⚠️</abbr>
			</h3>
			<img width="320"
				height="200"
				:src="src"
				:alt="alt">
		</router-link>
	</div>
</template>

<script>
import { DEFAULT_SKIN_IMAGE } from '../constants';

export default {
	name: 'Snapshot',
	props: {
		highlight: {
			type: Boolean,
			default: false
		},
		displayTitle: {
			type: Boolean,
			default: true
		},
		skinkey: {
			type: String,
			default: ''
		},
		unmaintained: {
			type: Boolean,
			default: false
		},
		compatible: {
			type: Boolean,
			default: true
		},
		beta: {
			type: Boolean
		},
		experimental: {
			type: Boolean
		},
		mightBreak: {
			type: Boolean
		},
		hasDependencies: {
			type: Boolean
		},
		stable: {
			type: Boolean,
			default: true
		},
		name: {
			type: String,
			default: '⠀'
		},
		url: {
			type: String,
			default: ''
		},
		src: {
			type: String,
			default: DEFAULT_SKIN_IMAGE
		}
	},
	computed: {
		snapshotClass() {
			return {
				'snapshot--highlight': this.highlight,
				'snapshot--unstable': !this.stable || !this.compatible,
				'snapshot--unmaintained': this.unmaintained,
				snapshot: true
			};
		},
		routerUrl() {
			return this.url ? this.url : ( this.skinkey ? `/skin/${this.skinkey}` : '' );
		},
		alt() {
			return `screenshot of ${this.name}`;
		}
	}
};
</script>

<style lang="less" scoped>
	@import '../variables.less';
	@height-snapshot: 180px;
	@height-heading: 40px;
	@height-img: @height-snapshot - @height-heading;

	.snapshot {
		width: 220px;
		height: @height-snapshot;
		flex-shrink: 1;
		box-sizing: border-box;
		position: relative;
		background: #000;
	}

	.snapshot--unmaintained:after {
		@height-unmaintained-img: 66px;
		@height-spacing-between-header-and-img: 22px;
		@height-spacing-between-img-and-text: 12px;
		content: 'unmaintained';
		text-transform: uppercase;
		display: block;
		position: absolute;
		left: 0;
		top: @height-heading + @height-spacing-between-header-and-img;
		right: 0;
		background-image: url( ./assets/unmaintained.svg );
		background-size: auto 66px;
		background-position: top center;
		background-repeat: no-repeat;
		text-align: center;
		color: white;
		height: 96px;
		box-sizing: border-box;
		padding-top: @height-unmaintained-img + @height-spacing-between-img-and-text;
		font-size: unit( (16/14), rem );
	}

	.snapshot--highlight h3 span {
		text-shadow: 0 4px 4px #00000040;
	}

	.snapshot--unmaintained img {
		opacity: 0.5;
	}

	h3 {
		background: @color-explore-main;
		text-transform: uppercase;
		padding: 12px;
		width: 100%;
		box-sizing: border-box;
		margin: 0;
		font-size: 12px;
		text-align: center;
		height: @height-heading;
	}

	h3 a {
		width: 100%;
		overflow: hidden;
		display: inline-block;
		text-overflow: ellipsis;
	}

	img {
		width: 100%;
		height: @height-img;
		background: #fff;
		display: block;
		object-fit: cover;
	}

	a {
		color: #000;
		text-decoration: none;
		display: block;
		z-index: 2;
		position: relative;
	}

	abbr {
		color: #ffd000;
	}

	footer {
		background: #fff;
		color: #333;
		font-size: 0.8em;
		width: 320px;
		padding: 10px 0;
		text-transform: uppercase;
	}
</style>
