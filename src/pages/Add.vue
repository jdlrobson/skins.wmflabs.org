<template>
	<Page class="page--new">
		<div>
			<div class="preview-header">
				<label>Preview of:</label>
				<div class="preview-header__name">
					<input
						type="text"
						placeholder="ENTER NAME OR CLICK THE DICE"
						:value="skinname"
						@input="updateName">
					<button
						class="preview-header__name__random"
						title="Generate random name"
						@click="newName">
						Change name
					</button>
				</div>
				<div class="preview-header__version-area">
					<label>Target version</label>
					1.43
				</div>
				<Btn
					:disabled="skinname === ''"
					@click="download">
					Download
				</Btn>
			</div>
			<Preview
				:html="html"
				:name="skinname"
				:anon-default="anon"
				:show-anon="true"
				@change-article="changeArticle"
				@change-anon="changeAnon"
			>
			</Preview>
			<div class="page__edit-area">
				<CdxTabs>
					<CdxTab
						v-for="( tab, index ) in tabsData"
						:key="index"
						:name="tab.name"
						:label="tab.label"
					>
						<template v-if="tab.name === 'html'">
							<textarea
								class="editor-textarea"
								:value="mustache"
								@input="updateMustache"></textarea>
						</template>
						<template v-if="tab.name === 'css'">
							<textarea
								class="editor-textarea"
								:value="less"
								@input="updateCSS"></textarea>
							<Btn
								class="css-theme-changer"
								@click="newTheme">
								Change theme
							</Btn>
							<ColorChart
								:colors="colorChart"
								@toggle-color="toggleColor"></ColorChart>
						</template>
						<template v-if="tab.name === 'js'">
							<textarea
								class="editor-textarea"
								:value="js"
								@input="updateJS"></textarea>
						</template>
					</CdxTab>
				</CdxTabs>
				<Btn
					class="reset-btn"
					:destructive="true"
					@click="reset">
					Reset
				</Btn>
			</div>
			<div class="data-explorer">
				<h2>Template data</h2>
				<p>Explore the data you can render in your skin here.</p>
				<JsonViewer
					:value="json"
					:boxed="true"
					:expanded="false"
					:sort="true"
					:copyable="true"></JsonViewer>
			</div>
			<p>
				Making an extension? Try the
				<router-link to="build/extension">
					extension builder
				</router-link>!
			</p>
			<p>
				You can now also create skins from the <a href="https://github.com/wikimedia/mediawiki-skins-cli#readme">command line</a>
			</p>
		</div>
	</Page>
</template>

<script>
/* eslint-disable vue/no-undef-properties */
/* global less */
import { CdxTab, CdxTabs } from '@wikimedia/codex';
import { PARTIALS, getLessVarsCode, getLessVarsRaw, JQUERY,
	buildSkin,
	getLESSFromTemplate, randomColor,
	buildDefaultAssets,
	getResourceLoaderSkinModuleStylesFromStylesheet,
	SCRIPTS, messages } from 'mediawiki-skins-cli';
import api from '../api.js';
import { TEST_ARTICLES, HOST, LESS_RENDER_OPTIONS } from '../constants';
import { render } from 'mustache';
import ColorChart from '../components/ColorChart.vue';
import Btn from '../components/Btn.vue';
import Preview from '../components/Preview.vue';
import nameMe from '../nameMe';
import JsonViewer from 'vue-json-viewer';
import Page from './Page.vue';
import fs from 'fs';
import { RouterLink } from 'vue-router';
const tokens = fs.readFileSync( './node_modules/@wikimedia/codex-design-tokens/theme-wikimedia-ui.less' ).toString();
const assets = buildDefaultAssets();
const DEFAULT_SKIN_MUSTACHE = assets.mustache;
const DEFAULT_SKIN_LESS = assets.less;
const LANGUAGES = {
	'msg-otherlanguages': 'Read in another language'
};
const DEFAULT_HTML = '<!DOCTYPE HTML><html><body>Loading preview...</body></html>';

const generateStylesheetLESS = () => `/* Styles */
${ DEFAULT_SKIN_LESS }
`;

const DEFAULT_SKIN_PROPS = {
	html: DEFAULT_HTML,
	anon: true,
	variables: getLessVarsRaw(),
	less: generateStylesheetLESS(),
	js: `/* scripts can go here */
`,
	mustache: DEFAULT_SKIN_MUSTACHE
};

/**
 * Clears all import statements from the string.
 * I couldn't work out how to setup print.less locally...
 *
 * @param {string} str
 * @return {string}
 */
const clearImports = ( str ) => str.replace( /@import ["'][^"']*["'];/g, '' );
function getCached() {
	const props = {};
	Object.keys( ( DEFAULT_SKIN_PROPS ) ).forEach( ( key ) => {
		let val = localStorage.getItem( `add-${ key }` );
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
		CdxTab, CdxTabs,
		RouterLink,
		Btn,
		Page,
		JsonViewer,
		Preview,
		ColorChart
	},
	data() {
		return Object.assign( getCached(), {
			templateDataReq: {},
			tabsData: [
				{
					name: 'html',
					label: 'HTML ( Mustache )',
					heading: 'Sand cat'
				}, {
					name: 'css',
					label: 'CSS',
					heading: 'View source for Sand cat'
				}, {
					name: 'js',
					label: 'JS',
					heading: 'Sand cat: Revision history'
				}
			],
			pending: null,
			variables: DEFAULT_SKIN_PROPS.variables,
			json: '',
			css: '', // will be derived from less data value.
			title: TEST_ARTICLES[ 0 ].title
		} );
	},
	computed: {
		colorChart() {
			return Object.keys( this.variables )
				.filter( ( key ) => this.variables[ key ].indexOf( '#' ) === 0 )
				.map( ( key ) => ( {
					key,
					color: this.variables[ key ]
				} ) );
		}
	},
	methods: {
		toggleColor( name ) {
			this.variables = Object.assign( this.variables, {
				[ name ]: randomColor()
			} );
			this.generatePreview();
		},
		updateJSON() {
			api.getSkinJSON( this.title, this.anon ).then( ( json ) => {
				this.json = json;
			} );
		},
		changeAnon( isAnon ) {
			this.anon = isAnon;
			localStorage.setItem( 'add-anon', isAnon );
			this.generatePreview();
			this.updateJSON();
		},
		reset() {
			const confirm = window.confirm( `Reset the skin (${ this.skinname }) you are currently working on? All changes will be lost!` );
			if ( confirm ) {
				Object.keys( DEFAULT_SKIN_PROPS ).forEach( ( key ) => {
					localStorage.removeItem( `add-${ key }` );
					this[ key ] = DEFAULT_SKIN_PROPS[ key ];
				} );
				// random stylesheet each time.
				this.newTheme();
				this.less = generateStylesheetLESS();
				this.js = DEFAULT_SKIN_PROPS.js;
				this.startingLess = this.less;
				this.generatePreview();
			}
		},
		newName( ev ) {
			this.skinname = nameMe();
			// unfocus to reset animation.
			setTimeout( () => {
				this.generatePreview();
				ev.target.blur();
			}, 500 );
			localStorage.setItem( 'add-skinname', this.skinname );
		},
		newTheme() {
			this.variables = Object.assign( {}, getLessVarsRaw() );
			this.generatePreview();
		},
		updateName( ev ) {
			this.skinname = ev.target.value;
			localStorage.setItem( 'add-skinname', this.skinname );
		},
		download() {
			buildSkin( this.skinname, this.mustache, this.less, this.js, this.variables );
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
			return `${ HOST }/wiki/${ title }?useskin=skinjson&testuser=${ this.anon ? '0' : '1' }`;
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
						messages( {} ).forEach( ( key ) => {
							const templateKey = 'msg-' + key;
							if ( !json[ templateKey ] ) {
								msgs[ templateKey ] = `{{${ key }}}`;
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
				// eslint-disable-next-line no-useless-escape
				const js = '<script>' + this.js + '<\/script>';
				const imports = getLESSFromTemplate( this.mustache );
				const lessVars = tokens + '\n' + getLessVarsCode( this.variables );

				less.render(
					`${ lessVars }${ clearImports( this.less ) }${ imports }`,
					LESS_RENDER_OPTIONS
				).then( ( compiledLess ) => {
					css = compiledLess.css;
					return this.getTemplateData( this.title );
				}, ( err ) => {
					css = '';
					// eslint-disable-next-line no-console
					console.log( `Error in LESS:\n ${ err.message }`, err );
					return this.getTemplateData( this.title );
				} ).then( ( data ) => {
					const OVERRIDES = {
						'msg-sitetitle': `Skin:${ this.skinname }`,
						'msg-tagline': 'A new MediaWiki skin is born',
						'html-subtitle': `<a target="_blank" href="${ this.getUrl( this.title ) }">View as JSON format</a>.`
					};
					this.html = `<!DOCTYPE HTML>
                <html>
                <head>
                  ${ JQUERY }
                  <style type="text/css">${ getResourceLoaderSkinModuleStylesFromStylesheet( css ) }</style>
                  <link rel="stylesheet" href="${ HOST }/w/load.php?lang=en&modules=ext.cite.styles%7Cext.echo.styles.badge%7Cext.math.styles%7Cext.wikihiero%7Cmediawiki.page.gallery.styles%7Cmediawiki.ui.icon%7Cmediawiki.ui.button%7Coojs-ui.styles.icons-alerts&only=styles">
                  <style type="text/css">${ css }</style>
                </head>
                <body>${ render( this.mustache, Object.assign( {}, data, OVERRIDES ), PARTIALS ) }
                ${ js }${ SCRIPTS }
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

<style lang="less">
@import '../variables.less';
.page--new {
	background: @color-create-light;

	> div {
		overflow: scroll;
	}
}

.page__edit-area {
	position: relative;
}

input {
	background: black;
	padding: 11px 24px;
	color: white;
	border: 0;
}

.editor-textarea {
	width: 100%;
	border: 0;
	padding: 30px;
	height: 400px;
}

.preview-header {
	margin-bottom: 15px;
	display: flex;
	align-items: center;

	label {
		margin-right: 13px;
	}

	input {
		margin-right: 7px;
		width: 400px;
		padding-right: 50px;
	}

	button {
		margin-right: 6px;

		&:last-child {
			margin-right: 0;
		}
	}
}

.btn.reset-btn {
	width: 54px;
	margin-top: 10px;
}

.data-explorer {
	width: 100%;
	height: 400px;
	text-align: left;
}

.css-theme-changer {
	margin: 0 auto;
	display: block;
}

.preview-header__name {
	position: relative;
}

.preview-header__name__random {
	background: none;
	cursor: pointer;
	border: 0;
	display: block;
	width: 20px;
	height: 22px;
	right: 20px;
	top: 9px;
	color: transparent;
	position: absolute;
	background-image: url(../components/assets/random.svg);
	transform: rotate(0deg);

	&:focus {
		transition: transform 0.4s ease-in;
		transform: rotate(480deg);
	}
}

.preview-header__version-area {
	align-items: end;
	display: flex;
	flex-direction: column;
	margin-right: 8px;

	label {
		margin-right: 0;
	}
}
</style>
