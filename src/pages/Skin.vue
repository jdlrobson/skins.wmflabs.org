<template>
	<Page class="page--skin">
		<Searcher
			:filter-key="skinkey"
			:show-no-results-message="false"
			@input="onSearch"></Searcher>
		<div class="content">
			<h2>{{ name }}</h2>
			<PreviewLauncher
				v-if="infoIsLoaded"
				:src="srcLarge"
				:skinkey="skinkey"
				:name="name"
				:maintained="!unmaintained"
				:available="preview">
			</PreviewLauncher>
			<p>
				by <span
					v-for="( author, i ) in authors"
					:key="'author-' + i"
				><RouterLink
					:to="'/explore/author:' + author">{{ author }}</RouterLink>&nbsp;</span>
			</p>
			<p v-if="license">
				Licensed under
				<RouterLink
					:to="`/explore/license:${license}`">
					<strong>{{ license }}</strong>
				</RouterLink>
			</p>
			<p v-if="created">
				Published to MediaWiki.org on {{ created }}
			</p>
			<h3 v-if="infoIsLoaded">
				About:
			</h3>
			<p v-if="infoIsLoaded">
				{{ summary }}
			</p>

			<SkinWarnings
				v-if="showWarnings"
				:url="mwUrl"
				:beta="beta"
				:experimental="experimental"
				:unmaintained="unmaintained"
				:has-dependencies="hasDependencies"
				:might-break="mightBreak"
				:compatible="compatible"
			></SkinWarnings>
			<h3 v-if="infoIsLoaded">
				View:
			</h3>
			<a
				v-for="( link, i ) in links"
				:key="i"
				class="skinLink"
				target="_blank"
				:href="link.href">{{ link.text }}</a>
		</div>
	</Page>
</template>

<script>
import api from '../api.js';
import PreviewLauncher from '../components/PreviewLauncher.vue';
import Page from './Page.vue';
import SkinWarnings from '../components/SkinWarnings.vue';
import Searcher from '../components/Searcher.vue';
import { RouterLink } from 'vue-router';

export default {
	name: 'Skin',
	components: {
		RouterLink,
		PreviewLauncher,
		SkinWarnings,
		Searcher,
		Page
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
			created: '',
			license: '',
			authors: [],
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
			return !this.stable || this.experimental ||
				!this.compatible ||
				this.mightBreak || this.hasDependencies || this.beta || this.unmaintained;
		},
		mwUrl() {
			return this.name ? `https://mediawiki.org/wiki/Skin:${ this.name }` : '';
		}
	},
	methods: {
		onSearch() {
			this.$router.push( '/explore' );
		}
	},
	mounted: function () {
		if ( this.$el.clientWidth < 768 ) {
			this.preview = false;
		}
		api.fetchSkinInfo( this.$route.params.key ).then( ( skin ) => {
			this.name = skin.name;
			if ( skin.src ) {
				this.src = skin.src;
			}
			this.preview = this.preview && skin.isCompatible;
			this.authors = ( skin.author || [] ).filter( ( a ) => a !== '...' );
			this.summary = skin.summary;
			this.stable = skin.stable;
			this.license = skin[ 'license-name' ];
			this.beta = skin.beta;
			this.unmaintained = skin.unmaintained;
			this.hasDependencies = skin.hasDependencies;
			this.mightBreak = skin.mightBreak;
			this.experimental = skin.experimental;
			this.links = skin.links;
			this.created = new Date( skin.created ).getFullYear();
			this.infoIsLoaded = true;
		}, () => {
			this.$router.replace( { path: '/404' } );
		} );
	}
};
</script>

<style lang="less" scoped>
	@import '../variables.less';
	.page--skin {
		background: @color-explore-light;
	}

	a {
		color: black;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	h2 {
		background: black;
		color: white;
		padding: 11px;
		text-align: center;
		font-size: 14px;
	}

	h2, h3 {
		text-transform: uppercase;
	}

	.skinLink {
		display: block;
		width: 320px;
	}

	.content {
		height: 100%;
		padding-bottom: 100px;
		overflow: scroll;
	}
</style>
