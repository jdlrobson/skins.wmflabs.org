<template>
	<div class="preview">
		<div v-if="enabled" class="preview__area">
			<a :href="href"
				class="link--new-window"
				target="_blank"
				@click="openNewWindow">
				View in new window
			</a>
			<iframe ref="iframe"
				sandbox="allow-same-origin allow-scripts"
				:class="iframeClass"
				:src="href"
				:width="w"
				:height="h"></iframe>
		</div>
		<div v-else class="preview__area preview__area--unavailable">
			Preview unavailable.
		</div>
		<warning-box v-if="!enabled">
			If you are the maintainer of the skin you can request preview is enabled
			by creating an <a target="_blank"
				:href="createIssue">issue</a>.
		</warning-box>
		<div class="preview__panel">
			<article-changer @changeArticle="changeArticle"></article-changer>
			<div class="medium-selector">
				<custom-select>
					<select @change="changeMedium">
						<option value="d">
							desktop
						</option>
						<option value="t">
							tablet
						</option>
						<option value="m">
							mobile
						</option>
					</select>
				</custom-select>
			</div>
			<div class="loggedin-selector">
				<custom-checkbox v-if="showAnon"
					:checked="anon"
					name="anon"
					@input="changeAnon">
					Anonymous
				</custom-checkbox>
			</div>
		</div>
	</div>
</template>

<script>
import ArticleChanger from '../components/ArticleChanger';
import WarningBox from '../components/WarningBox';
import CustomSelect from '../components/CustomSelect';
import CustomCheckbox from '../components/CustomCheckbox';

export default {
	name: 'Preview',
	components: {
		ArticleChanger,
		CustomSelect,
		CustomCheckbox,
		WarningBox
	},
	props: {
		showAnon: {
			type: Boolean,
			default: false
		},
		anonDefault: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: 'Skin'
		},
		html: {
			type: String,
			default: ''
		},
		href: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			window: null,
			anon: this.anonDefault,
			medium: !!localStorage.getItem( 'medium' )
		};
	},
	computed: {
		createIssue() {
			return `https://github.com/jdlrobson/skins.wmflabs.org/issues/new?assignees=&labels=&template=enable-preview-for-${this.name}-on-skins-wmflabs-org.md&title=Please+enable+my+skin+for+live+preview+option`;
		},
		iframeClass() {
			switch ( this.medium ) {
				case 'm':
					return 'iframe--mobile';
				case 't':
					return 'iframe--tablet';
				default:
					return 'iframe--desktop';
			}
		},
		w() {
			// These must be synced with the LESS variables defined in stylesheet.
			switch ( this.medium ) {
				case 'm':
					return 360;
					// Following have a 0.5 scale transform
				case 't':
					return 768;
				default:
					return 1800;
			}
		},
		h() {
			// These must be synced with the LESS variables defined in stylesheet.
			switch ( this.medium ) {
				case 'm':
					return 740;
				case 't':
					return 1024;
				default:
					return 1024;
			}
		},
		enabled() {
			return this.href || this.html;
		}
	},
	methods: {
		changeAnon( ev ) {
			this.$emit( 'changeAnon', ev.target.checked );
		},
		changeArticle( title ) {
			this.$emit( 'changeArticle', title );
		},
		openNewWindow( ev ) {
			if ( !ev.target.getAttribute( 'href' ) ) {
				ev.preventDefault();
				if ( !this.window || this.window.closed ) {
					this.window = open( 'preview.html', '' );
				}
				this.window.document.write( this.html );
			}
		},
		changeMedium: function ( ev ) {
			const medium = ev.target.value;
			this.medium = medium;
			localStorage.setItem( 'medium', medium );
		},
		refresh() {
			const iframe = this.$refs.iframe;
			const html = this.html;
			if ( iframe && html ) {

				let doc;
				if ( iframe.contentDocument ) {
					doc = iframe.contentDocument;
				} else if ( iframe.contentWindow ) {
					doc = iframe.contentWindow.document;
				} else {
					doc = iframe.document;
				}
				doc.open( '' );
				doc.writeln( html );
				doc.close();
			}
			if ( this.window ) {
				this.window.document.documentElement.innerHTML = html;
			}
		}
	},
	mounted() {
		this.refresh();
	},
	updated() {
		this.refresh();
	}
};
</script>

<style lang="less">
@import '../variables.less';
:root {
	--preview-width: 720;
	--preview-height: 240;
	--preview-width-mobile: 360;
	--preview-width-tablet: 768;
	--preview-width-desktop: 1800;
	--preview-height-desktop: 1024;
	--preview-height-tablet: 1024;
	--preview-height-mobile: 740;
}

.preview__area {
	position: relative;
	overflow: hidden;
	background: black;
	width: var(--preview-width);
	text-align: center;
	max-height: 240px;
}

iframe {
	margin: auto;
	background: white;
	display: block;
}

.iframe--tablet,
.iframe--desktop {
	transform-origin: 0 0;
}

.iframe--desktop {
	--scale-desktop: calc( var(--preview-width) / var(--preview-width-desktop) );
	transform: scale(var(--scale-desktop), var(--scale-desktop));
	width: calc( var(--preview-width-desktop) * 1px );
}

.iframe--tablet {
	--scale-tablet: calc( var(--preview-width) / var(--preview-width-tablet) );
	transform: scale(var(--scale-tablet), var(--scale-tablet));
}

.iframe--mobile {
	--scale-mobile: calc( var(--preview-width) / var(--preview-width-mobile) );
	width: calc( var(--preview-width-mobile) * 1px );
}

.preview__panel {
	padding: 8px;
	width: var(--preview-width);
	color: black;
	text-align: left;
	margin: 15px 0 20px 0;
	display: flex;
}

.article-changer {
	margin-right: 19px;
}

.loggedin-selector {
	margin-left: 50px;
	align-self: center;
	text-align: center;
}

.preview__area--unavailable {
	opacity: 0.5;
	background: gray;
	width: var(--preview-width);
	height: 480px;
	position: relative;
	padding-top: 260px;
}

.preview__area--unavailable:after {
	position: absolute;
	top: calc( 220px - 50px);
	bottom: 0;
	left: 0;
	right: 0;
	content: "\274c";
	font-size: 50px;
	color: #FFF;
	line-height: 100px;
	text-align: center;
}

.link--new-window {
	background: url(assets/newWindow.svg);
	width: 50px;
	height: 50px;
	padding: 0 0 10px 10px;
	background-position: right -4px top -4px;
	background-size: 40px 40px;
	background-repeat: no-repeat;
	display: block ruby;
	overflow: hidden;
	color: transparent;
	position: absolute;
	border: solid 4px transparent;
	background-color: @color-create-light;
	right: 0;
	top: 0;
	z-index: 1;
	box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.25);

	&:focus {
		border-color: orange;
	}
}
</style>
