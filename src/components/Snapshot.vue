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

<style scoped>
  .snapshot {
    width: 330px;
    color: #e80447;
    flex-shrink: 1;
    box-sizing: border-box;
    position: relative;
  }

  .snapshot--unmaintained:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
    height: 110px;
    background: url('../../assets/dead.png');
    background-size: 120px auto;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .snapshot--unmaintained img {
    opacity: 0.5;
  }
  h3 {
    background: white;
    padding: 12px;
    width: 320px;
    box-sizing: border-box;
    margin: 2px 0;
  }
  h3 a {
    width: 200px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }
  img {
    width: 320px;
    height: 200px;
    background: white;
    display: block;
    object-fit: cover;
  }
  a {
    color: #e80447;
  }

  abbr {
    color: #ffd000;
  }
  footer {
    background: white;
    color: #333;
    font-size: 0.8em;
    width: 320px;
    padding: 10px 0;
    text-transform: uppercase;
  }
</style>
