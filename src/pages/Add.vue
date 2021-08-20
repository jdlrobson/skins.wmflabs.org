<template>
	<div class="page--new">
		<h2>Create a new skin</h2>
		<two-column-layout>
			<template #column-one>
				<h3>HTML ( Mustache )</h3>
				<textarea :value="mustache" @input="updateMustache"></textarea>
				<h3>CSS / LESS</h3>
				<textarea :value="less" @input="updateCSS"></textarea>
				<h3>JS</h3>
				<textarea :value="js" @input="updateJS"></textarea>
				<h3>Name and download</h3>
				<input type="text"
					placeholder="Skin's name"
					:value="skinname"
					@input="updateName">
				<button class="btn"
					:disabled="skinname === ''"
					@click="download">
					Download as ZIP
				</button>
				<button class="btn" @click="reset">
					Reset
				</button>
			</template>
			<template #column-two>
				<preview :html="html" :name="skinname">
					<button class="css-theme-changer"
						@click="newTheme">
						Change theme
					</button>
					<article-changer @changeArticle="changeArticle"></article-changer>
					<input type="checkbox"
						:checked="anon"
						@input="changeAnon">Anonymous
				</preview>
				<div class="data-explorer">
					<h2>Template data</h2>
					<p>Explore the data you can render in your skin here.</p>
					<json-viewer :value="json"
						:boxed="true"
						:expanded="false"
						:sort="true"
						:copyable="true"></json-viewer>
				</div>
			</template>
		</two-column-layout>
	</div>
</template>

<script>
/* global less */
import { PARTIALS, getLessVars, JQUERY,
	DEFAULT_SKIN_MUSTACHE, generateStylesheetLESS, SCRIPTS, messages } from '../starter-template';
import api from '../api.js';
import build from '../export/index.js';
import { TEST_ARTICLES, HOST, LESS_RENDER_OPTIONS } from '../constants';
import { render } from 'mustache';
import Preview from '../components/Preview.vue';
import ArticleChanger from '../components/ArticleChanger';
import TwoColumnLayout from '../components/TwoColumnLayout.vue';
import nameMe from '../nameMe';
import JsonViewer from 'vue-json-viewer';
import { getTemplatesFromSourceCode,
	getResourceLoaderSkinModuleStylesFromStylesheet,
	getComponentLESSFiles, getComponentLESSRaw
} from '../utils';

const LANGUAGES = {
	'msg-otherlanguages': 'Read in another language'
};
const DEFAULT_HTML = '<!DOCTYPE HTML><html><body>Loading preview...</body></html>';

const DEFAULT_SKIN_PROPS = {
	html: DEFAULT_HTML,
	anon: true,
	variables: getLessVars(),
	less: generateStylesheetLESS(),
	js: `/* scripts can go here */
`,
	mustache: DEFAULT_SKIN_MUSTACHE,
	skinname: ''
};

function getCached() {
	const props = {};
	Object.keys( ( DEFAULT_SKIN_PROPS ) ).forEach( ( key ) => {
		let val = localStorage.getItem( `add-${key}` );
		if ( val === 'true' ) {
			val = true;
		} else if ( val === 'false' ) {
			val = false;
		}
		props[ key ] = val !== null ? val : DEFAULT_SKIN_PROPS[ key ];
	} );
	if ( !props.skinname ) {
		props.skinname = nameMe();
	}
	return props;
}

export default {
	name: 'Add',
	components: {
		JsonViewer,
		Preview,
		ArticleChanger,
		TwoColumnLayout
	},
	data() {
		return Object.assign( getCached(), {
			templateDataReq: {},
			pending: null,
			variables: DEFAULT_SKIN_PROPS.variables,
			startingLess: DEFAULT_SKIN_PROPS.less,
			json: '',
			css: '', // will be derived from less data value.
			title: TEST_ARTICLES[ 0 ].title
		} );
	},
	methods: {
		updateJSON() {
			api.getSkinJSON( this.title, this.anon ).then( ( json ) => {
				this.json = json;
			} );
		},
		changeAnon( ev ) {
			this.anon = ev.target.checked;
			localStorage.setItem( 'add-anon', this.anon );
			this.generatePreview();
			this.updateJSON();
		},
		reset() {
			const noConfirmationNeeded = DEFAULT_SKIN_PROPS.mustache === this.mustache &&
			this.startingLess === this.less;

			const confirm = noConfirmationNeeded || window.confirm( `Reset the skin (${this.skinname}) you are currently working on? All changes will be lost!` );
			if ( confirm ) {
				Object.keys( DEFAULT_SKIN_PROPS ).forEach( ( key ) => {
					localStorage.removeItem( `add-${key}` );
					this[ key ] = DEFAULT_SKIN_PROPS[ key ];
				} );
				this.skinname = nameMe();
				// random stylesheet each time.
				this.newTheme();
				this.less = generateStylesheetLESS();
				this.js = DEFAULT_SKIN_PROPS.js;
				this.startingLess = this.less;
				localStorage.setItem( 'add-skinname', this.skinname );
				this.generatePreview();
			}
		},
		newTheme() {
			this.variables = getLessVars();
			this.generatePreview();
		},
		updateName( ev ) {
			this.skinname = ev.target.value;
			localStorage.setItem( 'add-skinname', this.skinname );
		},
		download() {
			const templates = getTemplatesFromSourceCode( PARTIALS, this.mustache );
			const styles = getComponentLESSFiles( Object.keys( templates ), [
				'mediawiki.skin.variables',
				'variables.less'
			] );
			const importStatements = Object.keys( styles )
				.map( ( key ) => `@import "${key}";` ).join( '\n' );

			build(
				this.skinname,
				Object.assign(
					styles,
					{
						'variables.less': this.variables,
						'skin.less': `@import 'mediawiki.skin.variables.less';
@import "variables.less";
${this.less}
${importStatements}
`
					} ),
				templates,
				{
					'skin.js': this.js
				},
				messages()
			);
		},
		changeArticle( title ) {
			this.title = title;
			this.generatePreview();
			this.updateJSON();
		},
		updateCSS( ev ) {
			this.less = ev.target.value;
			this.generatePreview();
			localStorage.setItem( 'add-less', this.less );
		},
		updateJS( ev ) {
			this.js = ev.target.value;
			this.generatePreview();
			localStorage.setItem( 'add-js', this.js );
		},
		updateMustache( ev ) {
			this.mustache = ev.target.value;
			this.generatePreview();
			localStorage.setItem( 'add-mustache', this.mustache );
		},
		getUrl( title ) {
			return `${HOST}/wiki/${title}?useskin=skinjson&testuser=${this.anon ? '0' : '1'}`;
		},
		getTemplateData( title ) {
			const url = this.getUrl( title );
			if ( !this.templateDataReq[ url ] ) {
				this.templateDataReq[ url ] = fetch( url,
					{
						mode: 'cors'
					} )
					.then( ( r ) => r.json() ).then( ( json ) => {
						const msgs = {};
						messages().forEach( ( key ) => {
							const templateKey = 'msg-' + key;
							if ( !json[ templateKey ] ) {
								msgs[ templateKey ] = `{{${key}}}`;
							}
						} );
						return Object.assign( {}, json, msgs, LANGUAGES );
					} );
			}
			return this.templateDataReq[ url ];
		},
		generatePreview() {
			if ( this.pending ) {
				clearTimeout( this.pending );
			}
			this.html = DEFAULT_HTML;
			this.pending = setTimeout( () => {
				let css;
				const js = '<script>' + this.js + '<\/script>';
				const imports = getComponentLESSRaw(
					Object.keys(
						getTemplatesFromSourceCode( PARTIALS, this.mustache )
					)
				);

				less.render( this.variables + this.less + imports, LESS_RENDER_OPTIONS ).then( ( compiledLess ) => {
					css = compiledLess.css;
					return this.getTemplateData( this.title );
				}, ( err ) => {
					css = '';
					// eslint-disable-next-line no-console
					console.log( `Error in LESS:\n ${err.message}`, err );
					return this.getTemplateData( this.title );
				} ).then( ( data ) => {
					const OVERRIDES = {
						'msg-sitetitle': 'Skinomatic 4000',
						'msg-tagline': 'Presented to you in the skinomatic 4000',
						'html-subtitle': `<a target="_blank" href="${this.getUrl( this.title )}">View as JSON format</a>.`
					};
					this.html = `<!DOCTYPE HTML>
                <html>
                <head>
                  ${JQUERY}
                  <style type="text/css">${getResourceLoaderSkinModuleStylesFromStylesheet(css)}</style>
                  <link rel="stylesheet" href="${HOST}/w/load.php?lang=en&modules=ext.cite.styles%7Cext.echo.styles.badge%7Cext.math.styles%7Cext.wikihiero%7Cmediawiki.page.gallery.styles%7Cmediawiki.ui.icon%7Cmediawiki.ui.button%7Coojs-ui.styles.icons-alerts&only=styles">
                  <style type="text/css">${css}</style>
                </head>
                <body>${render( this.mustache, Object.assign( {}, data, OVERRIDES ), PARTIALS )}
                ${js}${SCRIPTS}
                </body></html>`;
				} );
			}, 300 );
		}
	},
	mounted() {
		this.generatePreview();
		this.updateJSON();
	}
};
</script>

<style scoped>
textarea {
  width: 320px;
  height: 400px;
}

input[type=text] {
  width: 320px;
  height: 40px;
}

.btn:disabled {
  opacity: 0.5;
}

.btn {
  color: #fff;
  background-color: #36c;
  border-color: #36c;
  padding-top: 5px;
  padding-bottom: 5px;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 12px;
  position: relative;
  min-height: 32px;
  border-radius: 2px;
  font-weight: bold;
  text-decoration: none;
  vertical-align: top;
  text-align: center;
  font-size: 16px;
  line-height: 1;
  box-sizing: border-box;
  margin-top: 20px;
}

.data-explorer {
  width: 100%;
  height: 400px;
  text-align: left;
}

.css-theme-changer {
	margin-top: 0;
}

@media (min-width: 1920px) {
  textarea {
    width: 1300px;
  }
}
</style>
