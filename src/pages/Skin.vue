<template>
	<page class="page--skin">
		<h2>Skin: {{ name }}</h2>
		<two-column-layout>
			<template #column-one>
				<h3>About</h3>
				<snapshot :stable="stable"
					:compatible="preview"
					:display-title="false"
					:name="name"
					:src="src"></snapshot>
				<p>{{ summary }}</p>
				<warning-box v-if="hasWarnings" class="warningbox">
					<span v-if="beta">Warning: This skin is marked as beta.</span>
					<span v-if="experimental">
						Warning: This skin has been marked as experimental.
					</span>
					<span v-if="hasDependencies">
						Warning: This skin requires additional setup.
					</span>
					<span v-if="mightBreak">
						Warning: This skin has been flagged to indicate this it may
						break in future MediaWiki versions
						without prompt action.
					</span>
					<span v-if="!compatible">
						Warning: This skin does not work with the latest MediaWiki release.
					</span>
					<span v-if="unmaintained">
						Warning: This skin is not maintained.
						It is likely incompatible with the current MediaWiki branch.
						If you like this skin, you can fork it and
						become it's maintainer.
						If you do this, please update the repository URL on
						<a :href="mwUrl">MediaWiki.org</a>.
					</span>
				</warning-box>
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
				<div v-else class="no-preview">
					<img :src="dead" alt="an emoji with crosses for eyes">
					<p><strong>This skin appears to be unmaintained.</strong></p>
					<p>
						If this is not true, please <a :href="mwUrl">review the skin's page</a>
						on MediaWiki.org for why.
						<pre>|status      = unmaintained &lt;!-- explanation --&gt; </pre>
						If you are the skin author, please address the problem described.
						If you are capable, you may want to fork this skin to fix this issue
						and update the download URL.
					</p>
				</div>
			</template>
		</two-column-layout>
	</page>
</template>

<script>
import api from '../api.js';
import TwoColumnLayout from '../components/TwoColumnLayout';
import Snapshot from '../components/Snapshot.vue';
import Page from './Page.vue';
import Preview from '../components/Preview.vue';
import WarningBox from '../components/WarningBox.vue';
import { HOST, TEST_ARTICLES, DEFAULT_SKIN_IMAGE } from '../constants';
import dead from '../../assets/dead.png';

export default {
	name: 'Skin',
	components: {
		Page,
		Snapshot,
		Preview,
		WarningBox,
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
		dead() {
			return dead;
		},
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
  .no-preview {
    display: flex;
    align-items: center;
    height: 100%;
    align-content: center;
    flex-wrap: wrap;
  }
  .no-preview > p {
    flex-grow: 1;
  }
  .no-preview > img {
    height: 200px;
    width: 200px;
  }
</style>
