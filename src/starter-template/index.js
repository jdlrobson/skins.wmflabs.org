/* global __dirname:false */
import fs from 'fs';
import build from './export/index.js';
import JSZip from 'jszip';

export const SKINS_LAB_VERSION = '2.0';
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
const WPSearch = fs.readFileSync( `${__dirname}/WPSearch.mustache` ).toString();
const Sidebar = fs.readFileSync( `${__dirname}/Sidebar.mustache` ).toString();
const Notifications = fs.readFileSync( `${__dirname}/Notifications.mustache` ).toString();
const PersonalMenu = fs.readFileSync( `${__dirname}/PersonalMenu.mustache` ).toString();
const Languages = fs.readFileSync( `${__dirname}/Languages.mustache` ).toString();
const Dropdown = fs.readFileSync( `${__dirname}/Dropdown.mustache` ).toString();
const AdminBar = fs.readFileSync( `${__dirname}/AdminBar.mustache` ).toString();
const AdminBarHome = fs.readFileSync( `${__dirname}/AdminBarHome.mustache` ).toString();
const AdminBarUser = fs.readFileSync( `${__dirname}/AdminBarUser.mustache` ).toString();
const AdminBarWithEdit = fs.readFileSync( `${__dirname}/AdminBarWithEdit.mustache` ).toString();
const EditBar = fs.readFileSync( `${__dirname}/EditBar.mustache` ).toString();

export const COMPONENT_STYLES = {
	AdminBarHome: fs.readFileSync( `${__dirname}/AdminBarHome.less` ).toString(),
	AdminBarUser: fs.readFileSync( `${__dirname}/AdminBarUser.less` ).toString(),
	AdminBarWithEdit: fs.readFileSync( `${__dirname}/AdminBar.less` ).toString(),
	AdminBar: fs.readFileSync( `${__dirname}/AdminBar.less` ).toString(),
	EditBar: fs.readFileSync( `${__dirname}/EditBar.less` ).toString(),
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
	EditBar,
	AdminBar, AdminBarWithEdit, AdminBarUser, AdminBarHome,
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
	Portlet,
	WPSearch
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

/**
 *
 * @param {string[]} componentNames name array
 * @return {Array} of components with styles.
 */
function getComponentLESSFileNames( componentNames ) {
	return componentNames.filter(
		// Only if one was declared.
		( key ) => !!COMPONENT_STYLES[ key ]
	);
}

/**
 *
 * @param {string[]} componentNames name array
 * @param {string[]} imports (e.g. ['variables.less'])
 * @return {Object} of components with styles.
 */
export function getComponentLESSFiles( componentNames, imports ) {
	const mapping = {};
	getComponentLESSFileNames( componentNames ).forEach( ( name ) => {
		const importStatements = imports.map(
			( lessFile ) => `@import "${lessFile}";`
		).join( '\n' );
		mapping[ `${name}.less` ] = `
${importStatements}
${COMPONENT_STYLES[ name ]}
`;
	} );
	return mapping;
}

export function getTemplatesFromSourceCode( partials, sourceCode ) {
	const usedPartials = {};
	Object.keys( partials ).filter( ( name ) => {
		// Is the partial in the sourceCode?
		const re = new RegExp( `{{> *${name} *}}` );
		return !!sourceCode.match( re );
	} ).forEach( ( key ) => {
		const others = Object.keys( getTemplatesFromSourceCode( partials, partials[ key ] ) );
		usedPartials[ key ] = partials[ key ];
		others.forEach( ( otherKey ) => {
			usedPartials[ otherKey ] = partials[ otherKey ];
		} );
	} );

	return Object.assign( usedPartials, {
		skin: sourceCode
	} );
}

export function buildSkin( name, mustache, less, js = '', variables = '', options = {} ) {
	const templates = getTemplatesFromSourceCode( PARTIALS, mustache );
	const styles = getComponentLESSFiles( Object.keys( templates ), [
		'mediawiki.skin.variables',
		'variables.less'
	] );
	let importStatements = Object.keys( styles )
		.map( ( key ) => `@import "${key}";` ).join( '\n' );

	if ( !options.isCSS ) {
		importStatements += `@import "common.less";
`;
	}
	const mainCss = options.isCSS ? 'common.css' : 'common.less';

	build(
		name,
		Object.assign(
			styles,
			{
				[ mainCss ]: less,
				'variables.less': variables,
				'skin.less': `@import 'mediawiki.skin.variables.less';
@import "variables.less";
${importStatements}
`
			} ),
		templates,
		{
			'skin.js': js
		},
		messages(),
		options.Zipper || JSZip,
		options.CustomFileSaver
	);
}

/**
 *
 * @param {string[]} componentNames name array
 * @return {Array} of components with styles.
 */
function getComponentLESSRaw( componentNames ) {
	return getComponentLESSFileNames( componentNames ).map(
		( key ) => COMPONENT_STYLES[ key ]
	).join( '\n' );
}

export function getFeaturesFromStyles( styles ) {
	const match = styles.match( /\/\*+ +ResourceLoaderSkinModule: ([^*]*) *[*]+/ );
	const result = {};
	if ( match && match[ 1 ] ) {
		match[ 1 ].split( ',' ).map( ( a ) => a.trim() ).forEach( ( key ) => {
			if ( DEFAULT_FEATURES[ key ] !== undefined ) {
				result[ key ] = true;
			}
		} );
		return result;
	} else {
		return DEFAULT_FEATURES;
	}
}

export function getLESSFromTemplate( mustache ) {
	return getComponentLESSRaw(
		Object.keys(
			getTemplatesFromSourceCode( PARTIALS, mustache )
		)
	);
}
