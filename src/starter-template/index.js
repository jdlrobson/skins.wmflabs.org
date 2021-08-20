/* global __dirname:false */
import fs from 'fs';

export const SKINS_LAB_VERSION = '1.0';
export const MW_MIN_VERSION = '1.37.0';

const FooterList = fs.readFileSync( `${__dirname}/FooterList.mustache` ).toString();
const Portlet = fs.readFileSync( `${__dirname}/Portlet.mustache` ).toString();
const ContentIndicators = fs.readFileSync( `${__dirname}/ContentIndicators.mustache` ).toString();
const Notices = fs.readFileSync( `${__dirname}/Notices.mustache` ).toString();
const ContentHeading = fs.readFileSync( `${__dirname}/ContentHeading.mustache` ).toString();
const ContentActions = fs.readFileSync( `${__dirname}/ContentActions.mustache` ).toString();
const ContentNamespaces = fs.readFileSync( `${__dirname}/ContentNamespaces.mustache` ).toString();
const ContentBody = fs.readFileSync( `${__dirname}/ContentBody.mustache` ).toString();
const ContentTagline = fs.readFileSync( `${__dirname}/ContentTagline.mustache` ).toString();
const Footer = fs.readFileSync( `${__dirname}/Footer.mustache` ).toString();
const Logo = fs.readFileSync( `${__dirname}/Logo.mustache` ).toString();
const Search = fs.readFileSync( `${__dirname}/Search.mustache` ).toString();
const Sidebar = fs.readFileSync( `${__dirname}/Sidebar.mustache` ).toString();
const Notifications = fs.readFileSync( `${__dirname}/Notifications.mustache` ).toString();
const PersonalMenu = fs.readFileSync( `${__dirname}/PersonalMenu.mustache` ).toString();
const Languages = fs.readFileSync( `${__dirname}/Languages.mustache` ).toString();
const Dropdown = fs.readFileSync( `${__dirname}/Dropdown.mustache` ).toString();

export const COMPONENT_STYLES = {
	PersonalMenu: fs.readFileSync( `${__dirname}/PersonalMenu.less` ).toString(),
	ContentActions: fs.readFileSync( `${__dirname}/ContentActions.less` ).toString(),
	Dropdown: fs.readFileSync( `${__dirname}/Dropdown.less` ).toString(),
	ContentNamespaces: fs.readFileSync( `${__dirname}/ContentNamespaces.less` ).toString(),
	Portlet: fs.readFileSync( `${__dirname}/Portlet.less` ).toString(),
	Notifications: fs.readFileSync( `${__dirname}/Notifications.less` ).toString(),
	Sidebar: fs.readFileSync( `${__dirname}/Sidebar.less` ).toString(),
	Footer: fs.readFileSync( `${__dirname}/Footer.less` ).toString(),
	Logo: fs.readFileSync( `${__dirname}/Logo.less` ).toString(),
	Search: fs.readFileSync( `${__dirname}/Search.less` ).toString()
};

export const FEATURE_STYLES = {
	normalize: fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/normalize.css` ).toString(),
	elements: fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/elements.css` ).toString(),
	'content-tables': fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/content-tables.css` ).toString(),
	'content-links': fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/content-links.css` ).toString(),
	'content-media': fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/content-media.css` ).toString(),
	'interface-message-box': fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/interface-message-box.css` ).toString(),
	'interface-category': fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/interface-category.css` ).toString(),
	toc: fs.readFileSync( `${__dirname}/ResourceLoaderSkinModule/toc.css` ).toString()
};

export const PARTIALS = {
	Languages,
	Dropdown,
	Notifications,
	PersonalMenu,
	Footer,
	Logo,
	Search,
	Sidebar,
	FooterList,
	ContentHeading,
	ContentActions,
	ContentNamespaces,
	ContentTagline,
	ContentBody,
	Notices,
	ContentIndicators,
	Portlet
};

export const messages = () => {
	const msgs = [];
	Object.keys( PARTIALS ).forEach( ( key ) => {
		const text = PARTIALS[ key ];
		const match = text.match( /{{msg-[^}]*}}/g );
		if ( match ) {
			match.forEach( ( result ) => {
				msgs.push( result.replace( '{{msg-', '' ).replace( '}}', '' ) );
			} );
		}
	} );
	return msgs;
};
export const DEFAULT_SKIN_MUSTACHE = fs.readFileSync( `${__dirname}/skin.mustache` ).toString();

export const randomColor = () => {
	return '#' + Math.floor( Math.random() * 16777215 ).toString( 16 );
};

export const getLessVars = () => {
	const vars = {
		'background-color-base': randomColor(),
		'background-color-article': 'white',
		'color-base': '#54595d',
		'color-gray': '#a2a9b1',
		'color-gray-2': '#eaecf0',
		'color-link': '#0645ad',
		'color-link--visited': '#0b0080',
		'font-family': "'Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI','Oxygen','Ubuntu','Cantarell','Helvetica Neue',sans-serif"
	};
	return Object.keys( vars ).map( ( key ) => {
		return `@${key}: ${vars[ key ]};`;
	} ).join( '\n' );
};

const DEFAULT_SKIN_LESS = fs.readFileSync( `${__dirname}/skin.less` ).toString();

export const generateStylesheetLESS = () => {
	return `/* Styles */
${DEFAULT_SKIN_LESS}
`;

};

export const JQUERY = `
<script src="https://en.wikipedia.org//w/resources/lib/jquery/jquery.js"></script>
`;

export const SCRIPTS = `
<script>
document.body.addEventListener('click', function (ev) {
    var parent = ev.target;
    while(parent !== ev.currentTarget) {
        if(parent.tagName === 'A' && parent.getAttribute('href')) {
            ev.preventDefault();
            return;
        }
        parent = parent.parentNode;
    }
});
window.dispatchEvent(new Event('load'));
</script>
`;

// Keep synced with https://github.com/jdlrobson/mediawiki-skins-skinjson/blob/master/skin.json#L37
export const DEFAULT_FEATURES = {
	normalize: true,
	elements: true,
	'content-tables': true,
	'content-links': true,
	'content-media': true,
	'content-links-external': false,
	'interface-message-box': true,
	'interface-category': true,
	toc: true
};
