<template>
	<page class="page--skin">
		<searcher :filter-key="skinkey"
			:show-no-results-message="false"
			@input="onSearch"></searcher>
		<div class="content">
			<h2>Skin: {{ name }}</h2>
			<preview-launcher
				:src="srcLarge"
				:skinkey="skinkey"
				:name="name"
				:available="preview">
			</preview-launcher>
			<h3>About</h3>
			<p>{{ summary }}</p>
			<skin-warnings v-if="showWarnings"
				:url="mwUrl"
				:beta="beta"
				:experimental="experimental"
				:unmaintained="unmaintained"
				:has-dependencies="hasDependencies"
				:might-break="mightBreak"
				:compatible="compatible"
			></skin-warnings>
			<a v-for="(link,i) in links"
				:key="i"
				class="skinLink"
				target="_blank"
				:href="link.href">{{ link.text }}</a>
		</div>
	</page>
</template>

<script>
import api from '../api.js';
import Snapshot from '../components/Snapshot.vue';
import PreviewLauncher from '../components/PreviewLauncher.vue';
import Page from './Page.vue';
import SkinWarnings from '../components/SkinWarnings.vue';
import Searcher from '../components/Searcher.vue';

export default {
	name: 'Skin',
	components: {
		PreviewLauncher,
		SkinWarnings,
		Searcher,
		Page,
		Snapshot
	},
	data() {
		return {
			infoIsLoaded: false,
			unmaintained: true,
			mightBreak: false,
			stable: true,
			preview: true,
			compatible: true,
			skinkey: this.$route.params.key,
			name: this.$route.params.key.replace( /[^⠀]/g, '⠀' ) + '⠀',
			links: [],
			beta: false,
			hasDependencies: false,
			experimental: false,
			src: '',
			summary: ''
		};
	},
	computed: {
		srcLarge() {
			return this.src.replace( '400px', '1000px' );
		},
		showWarnings() {
			if ( !this.infoIsLoaded ) {
				return false;
			}
			return !this.stable || !this.preview || this.experimental ||
				!this.compatible ||
				this.mightBreak || this.hasDependencies || this.beta || this.unmaintained;
		},
		mwUrl() {
			return this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : '';
		}
	},
	methods: {
		onSearch() {
			this.$router.push( '/explore' );
		}
	},
	mounted: function () {
		api.fetchSkinInfo( this.$route.params.key ).then( ( skin ) => {
			this.name = skin.name;
			if ( skin.src ) {
				this.src = skin.src;
			}
			this.summary = skin.summary;
			this.stable = skin.stable;
			this.beta = skin.beta;
			this.unmaintained = skin.unmaintained;
			this.hasDependencies = skin.hasDependencies;
			this.mightBreak = skin.mightBreak;
			this.experimental = skin.experimental;
			this.preview = skin.compatible;
			this.links = skin.links;
			this.infoIsLoaded = true;
		}, () => {
			this.$router.replace( { path: '/404' } );
		} );
	}
};
</script>

<style scoped>
	.content {
		text-align: center;
	}
	.preview-launcher {
		width: 630px;
		margin: auto;
	}
	.skinLink {
		text-align: center;
		display: block;
		width: 320px;
		margin: 0 auto 10px;
	}
</style>
