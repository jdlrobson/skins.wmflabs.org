<template>
	<page class="page--skin">
		<h2>Skin: {{ name }}</h2>
		<two-column-layout><template #column-one>
			<h3>About</h3>
			<snapshot :stable="stable"
				:compatible="preview"
				:display-title="false"
				:name="name"
				:src="src"></snapshot>
			<p>{{ summary }}</p>
			<skin-warnings v-if="hasWarnings"
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
		</template>
		<template #column-two>
			<preview v-if="!unmaintained || !infoIsLoaded"
				:href="href"
					@changeArticle="changeArticle"
				:name="name">
			</preview>
			<unmaintained-skin v-else :url="mwUrl"></unmaintained-skin>
		</template></two-column-layout>
	</page>
</template>

<script>
import api from '../api.js';
import TwoColumnLayout from '../components/TwoColumnLayout';
import UnmaintainedSkin from '../components/UnmaintainedSkin.vue';
import Snapshot from '../components/Snapshot.vue';
import Page from './Page.vue';
import Preview from '../components/Preview.vue';
import SkinWarnings from '../components/SkinWarnings.vue';
import { HOST, TEST_ARTICLES, DEFAULT_SKIN_IMAGE } from '../constants';

export default {
	name: 'Skin',
	components: {
		UnmaintainedSkin,
		SkinWarnings,
		Page,
		Snapshot,
		Preview,
		TwoColumnLayout
	},
	data() {
		return {
			infoIsLoaded: false,
			unmaintained: true,
			mightBreak: false,
			stable: true,
			testArticle: TEST_ARTICLES[ 0 ].title,
			preview: true,
			compatible: true,
			skinkey: this.$route.params.key,
			name: this.$route.params.key.replace( /[^⠀]/g, '⠀' ) + '⠀',
			links: [],
			beta: false,
			hasDependencies: false,
			experimental: false,
			summary: '',
			src: DEFAULT_SKIN_IMAGE
		};
	},
	computed: {
		hasWarnings() {
			return !this.stable || !this.preview || this.experimental ||
				!this.compatible ||
				this.mightBreak || this.hasDependencies || this.beta || this.unmaintained;
		},
		mwUrl() {
			return this.name ? `https://mediawiki.org/wiki/Skin:${this.name}` : '';
		},
		href() {
			return this.stable && this.preview ? `${HOST}/wiki/${this.testArticle}?useformat=desktop&useskin=${this.skinkey}` :
				undefined;
		}
	},
	methods: {
		changeArticle( a ) {
			this.testArticle = a;
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
  .warningbox,
  p {
    width: 320px;
  }
  .skinLink {
    display: block;
    margin-bottom: 10px;
    width: 320px;
  }
</style>
