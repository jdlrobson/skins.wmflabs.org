<template>
	<page class="page--new"><div>
		<div class="preview-header">
			<label>Preview of:</label>
			<div class="preview-header__name">
				<input type="text"
					placeholder="Skin's name"
					:value="skinname"
					@input="updateName">
				<button class="preview-header__name__random"
					title="Generate random name"
					@click="newName">
					Change name
				</button>
			</div>
			<button class="btn"
				:disabled="skinname === ''"
				@click="download">
				Download
			</button>
		</div>
		<preview :html="html"
			:name="skinname"
			:anon-default="anon"
			:show-anon="true"
			@changeArticle="changeArticle"
			@changeAnon="changeAnon"
		>
		</preview>
		<div class="page__edit-area">
			<button class="btn btn--destructive reset-btn" @click="reset">
				Reset
			</button>
			<tabs>
				<tab title="HTML ( Mustache )">
					<textarea class="editor-textarea"
						:value="mustache"
						@input="updateMustache"></textarea>
				</tab>
				<tab title="CSS / LESS">
					<textarea class="editor-textarea"
						:value="less"
						@input="updateCSS"></textarea>
					<button class="btn css-theme-changer"
						@click="newTheme">
						Change theme
					</button>
					<color-chart :colors="colorChart"></color-chart>
				</tab>
				<tab title="JS">
					<textarea class="editor-textarea"
						:value="js"
						@input="updateJS"></textarea>
				</tab>
			</tabs>
		</div>
		<div class="data-explorer">
			<h2>Template data</h2>
			<p>Explore the data you can render in your skin here.</p>
			<json-viewer :value="json"
				:boxed="true"
				:expanded="false"
				:sort="true"
				:copyable="true"></json-viewer>
		</div>
	<div></page>
</template>

<script>
/* global less */
import { PARTIALS, getLessVarsCode, getLessVarsRaw, JQUERY,
	buildSkin, getLESSFromTemplate,
	DEFAULT_SKIN_MUSTACHE, generateStylesheetLESS, SCRIPTS, messages } from '../starter-template';
import api from '../api.js';
import { TEST_ARTICLES, HOST, LESS_RENDER_OPTIONS } from '../constants';
import { render } from 'mustache';
import ColorChart from '../components/ColorChart.vue';
import Tabs from '../components/Tabs.vue';
import Tab from '../components/Tab.vue';
import Preview from '../components/Preview.vue';
import nameMe from '../nameMe';
import JsonViewer from 'vue-json-viewer';
import Page from './Page.vue';

import {
	getResourceLoaderSkinModuleStylesFromStylesheet
} from '../utils';

const LANGUAGES = {
	'msg-otherlanguages': 'Read in another language'
};
const DEFAULT_HTML = '<!DOCTYPE HTML><html><body>Loading preview...</body></html>';

const DEFAULT_SKIN_PROPS = {
	html: DEFAULT_HTML,
	anon: true,
	variables: getLessVarsRaw(),
	less: generateStylesheetLESS(),
	js: `/* scripts can go here */
`,
	mustache: DEFAULT_SKIN_MUSTACHE
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
		Page,
		Tabs,
		Tab,
		JsonViewer,
		Preview,
		ColorChart
	},
	data() {
		return Object.assign( getCached(), {
			templateDataReq: {},
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
			const confirm = window.confirm( `Reset the skin (${this.skinname}) you are currently working on? All changes will be lost!` );
			if ( confirm ) {
				Object.keys( DEFAULT_SKIN_PROPS ).forEach( ( key ) => {
					localStorage.removeItem( `add-${key}` );
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
		newName() {
			this.skinname = nameMe();
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
				// eslint-disable-next-line no-useless-escape
				const js = '<script>' + this.js + '<\/script>';
				const imports = getLESSFromTemplate( this.mustache );

				less.render( getLessVarsCode( this.variables ) + this.less + imports, LESS_RENDER_OPTIONS ).then( ( compiledLess ) => {
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
                  <style type="text/css">${getResourceLoaderSkinModuleStylesFromStylesheet( css )}</style>
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
		width: 306px;
		padding-right: 50px;
	}

	button {
		margin-right: 6px;

		&:last-child {
			margin-right: 0;
		}
	}
}

.btn {
	color: #fff;
	background: #000;
	text-transform: uppercase;
	padding: 11px 10px;
	min-width: 98px;
	position: relative;
	border: solid 3px transparent;
	height: 40px;
	font-weight: bold;
	text-decoration: none;
	vertical-align: top;
	text-align: center;
	line-height: 1;
	box-sizing: border-box;

	&:focus,
	&:hover {
		background: @color-create-darkest;
	}

	&:active {
		background: @color-create-darkest;
		border-color: #000;
		opacity: 0.8;
	}

	&::disabled {
		opacity: 0.5;
	}
}

.reset-btn {
	position: absolute;
	min-width: 68px;
	right: 0;
	top: -67px;
	width: 68px;
	padding: 0;
}

.btn--destructive {
	background: @color-reset;
	color: #fff;

	&:focus,
	&:hover,
	&:active {
		background: @color-reset;
		color: transparent;
		background-repeat: no-repeat;
		background-position: center;
		background-image: url(../components/assets/reset.svg);
	}

	&:active {
		opacity: 0.8;
	}
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
	height: 20px;
	right: 20px;
	top: 10px;
	color: transparent;
	position: absolute;
	background-image: url(../components/assets/random.svg);
}
</style>
