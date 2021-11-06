import build from './export/index.js';
import JSZip from 'jszip';
import FooterList from './FooterList.mustache';
import Portlet from './Portlet.mustache';
import ContentIndicators from './ContentIndicators.mustache';
import Notices from './Notices.mustache';
import ContentHeading from './ContentHeading.mustache';
import ContentActions from './ContentActions.mustache';
import ContentNamespaces from './ContentNamespaces.mustache';
import ContentBody from './ContentBody.mustache';
import ContentTagline from './ContentTagline.mustache';
import Footer from './Footer.mustache';
import Logo from './Logo.mustache';
import Search from './Search.mustache';
import WPSearch from './WPSearch.mustache';
import Sidebar from './Sidebar.mustache';
import Notifications from './Notifications.mustache';
import PersonalMenu from './PersonalMenu.mustache';
import Languages from './Languages.mustache';
import Dropdown from './Dropdown.mustache';
import AdminBar from './AdminBar.mustache';
import AdminBarHome from './AdminBarHome.mustache';
import AdminBarUser from './AdminBarUser.mustache';
import AdminBarWithEdit from './AdminBarWithEdit.mustache';
import EditBar from './EditBar.mustache';

import AdminBarHomeLESS from './AdminBarHome.less';
import AdminBarUserLESS from './AdminBarUser.less';
import AdminBarWithEditLESS from './AdminBar.less';
import AdminBarLESS from './AdminBar.less';
import EditBarLESS from './EditBar.less';
import PersonalMenuLESS from './PersonalMenu.less';
import ContentActionsLESS from './ContentActions.less';
import DropdownLESS from './Dropdown.less';
import ContentNamespacesLESS from './ContentNamespaces.less';
import PortletLESS from './Portlet.less';
import NotificationsLESS from './Notifications.less';
import SidebarLESS from './Sidebar.less';
import FooterLESS from './Footer.less';
import LogoLESS from './Logo.less';
import SearchLESS from './Search.less';
import { getFeaturesFromStyles, getTemplatesFromSourceCode } from './utils';

export const COMPONENT_STYLES = {
	AdminBarHome: AdminBarHomeLESS,
	AdminBarUser: AdminBarUserLESS,
	AdminBarWithEdit: AdminBarWithEditLESS,
	AdminBar: AdminBarLESS,
	EditBar: EditBarLESS,
	PersonalMenu: PersonalMenuLESS,
	ContentActions: ContentActionsLESS,
	Dropdown: DropdownLESS,
	ContentNamespaces: ContentNamespacesLESS,
	Portlet: PortletLESS,
	Notifications: NotificationsLESS,
	Sidebar: SidebarLESS,
	Footer: FooterLESS,
	Logo: LogoLESS,
	Search: SearchLESS
};

import normalize from './ResourceLoaderSkinModule/normalize.css';
import elements from './ResourceLoaderSkinModule/elements.css';
import CONTENT_TABLES from './ResourceLoaderSkinModule/content-tables.css';
import CONTENT_LINKS from './ResourceLoaderSkinModule/content-links.css';
import CONTENT_MEDIA from './ResourceLoaderSkinModule/content-media.css';
import INTERFACE_MESSAGE_BOX from './ResourceLoaderSkinModule/interface-message-box.css';
import INTERFACE_CATEGORY from './ResourceLoaderSkinModule/interface-category.css';
import INTERFACE_TOC from './ResourceLoaderSkinModule/toc.css';

export const FEATURE_STYLES = {
	normalize,
	elements,
	'content-tables': CONTENT_TABLES,
	'content-links': CONTENT_LINKS,
	'content-media': CONTENT_MEDIA,
	'interface-message-box': INTERFACE_MESSAGE_BOX,
	'interface-category': INTERFACE_CATEGORY,
	toc: INTERFACE_TOC
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

import DEFAULT_SKIN_MUSTACHE from './skin.mustache';
export { DEFAULT_SKIN_MUSTACHE };

/**
 * @param {number} c
 * @return {string} hex
 */
function componentToHex( c ) {
	const hex = c.toString( 16 );
	return hex.length === 1 ? '0' + hex : hex;
}

/**
 *
 * @param {Object} rgb
 * @return {string} hexcode.
 */
function rgbToHex( rgb ) {
	return '#' + componentToHex( rgb.r ) + componentToHex( rgb.g ) + componentToHex( rgb.b );
}

export const randomColor = () => {
	return rgbToHex(
		{
			r: Math.floor( Math.random() * 255 ),
			g: Math.floor( Math.random() * 255 ),
			b: Math.floor( Math.random() * 255 )
		}
	);
};

/**
 * @param {number} h hue 0-360
 * @param {number} s saturation between 0 and 1
 * @param {number} l lightness between 0 and 1
 * @return {Object} rgb
 */
function hslToRgb( h, s, l ) {
	// h (hue) between 0 and 360, s (saturation) & l (lightness) between 0 and 1
	const c = l <= 0.5 ? 2 * l * s : ( 2 - ( 2 * l ) ) * s;
	const h1 = h / 60;
	const x = c * ( 1 - Math.abs( ( h1 % 2 ) - 1 ) );
	let r, g, b;
	if ( h1 >= 0 && h1 < 1 ) {
		r = c;
		g = x;
		b = 0;
	} else if ( h1 >= 1 && h1 < 2 ) {
		r = x;
		g = c;
		b = 0;
	} else if ( h1 >= 2 && h1 < 3 ) {
		r = 0;
		g = c;
		b = x;
	} else if ( h1 >= 3 && h1 < 4 ) {
		r = 0;
		g = x;
		b = c;
	} else if ( h1 >= 4 && h1 < 5 ) {
		r = x;
		g = 0;
		b = c;
	} else if ( h1 >= 5 && h1 < 6 ) {
		r = c;
		g = 0;
		b = x;
	}
	const m = l - ( 0.5 * c );
	return {
		r: parseInt( ( r + m ) * 255, 10 ),
		g: parseInt( ( g + m ) * 255, 10 ),
		b: parseInt( ( b + m ) * 255, 10 )
	};
}

/**
 * Return random number between min and max.
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function generateRandomNumber( min, max ) {
	return ( Math.random() * ( max - min ) ) + min;
}

/**
 * Returns object of RGB keys to hex
 *
 * @param {Object} obj
 * @return {Object}
 */
const rgbVarsToHex = ( obj ) => {
	const newObj = {};
	Object.keys( obj ).forEach( ( key ) => {
		newObj[ key ] = rgbToHex( obj[ key ] );
	} );
	return newObj;
};

export const getLessVarsRaw = () => {
	const isDarkMode = Math.round( Math.random() ) === 0;
	const primary = Math.floor( Math.random() * 359 );
	const saturation = generateRandomNumber( 0.3, 0.7 );
	const dark = generateRandomNumber( 0, 0.15 );
	const pale = generateRandomNumber( 0.85, 1 );
	const delta = ( ( pale - dark ) / 4 );
	const mid = dark + delta;
	const light = dark + ( delta * 2 );
	const complementaryHue = ( primary + 180 ) % 360;
	const seed = Math.floor( ( 85 * Math.random() ) + 5 ); // we want it to be at least 5 degrees
	let secondary = ( complementaryHue + seed ) % 360;
	let tertiary = ( complementaryHue - seed ) % 360;
	if ( secondary < 0 ) {
		secondary = 360 + secondary;
	}
	if ( tertiary < 0 ) {
		tertiary = 360 + tertiary;
	}

	const colorLinkLightness = isDarkMode ? 0.7 : 0.4;
	const colorLinkLightnessStep = isDarkMode ? -0.05 : 0.05;

	const vars = {
		'background-color-warning': hslToRgb( tertiary, saturation, isDarkMode ? dark : pale ),
		'background-color-base': hslToRgb( tertiary, saturation, isDarkMode ? mid : light ),
		'background-color-article': hslToRgb( secondary, saturation, isDarkMode ? dark : pale ),
		'background-color-thumb': hslToRgb( tertiary, saturation, isDarkMode ? dark : pale ),
		'color-thumb': hslToRgb( tertiary, saturation, isDarkMode ? pale : dark ),
		'color-base': hslToRgb( primary, saturation, isDarkMode ? pale : dark ),
		'color-gray': hslToRgb( primary, saturation, isDarkMode ? light : mid ),
		'color-gray-2': hslToRgb( primary, saturation, isDarkMode ? mid : light ),
		'color-link': hslToRgb( secondary, saturation, colorLinkLightness ),
		'color-link--active': hslToRgb( secondary, saturation, colorLinkLightness + colorLinkLightnessStep ),
		'color-link--visited': hslToRgb( secondary, saturation, colorLinkLightness + ( colorLinkLightnessStep / 2 ) )
	};

	return Object.assign( rgbVarsToHex( vars ), {
		'font-family': "'Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI','Oxygen','Ubuntu','Cantarell','Helvetica Neue',sans-serif",
		'icon-filter': isDarkMode ? 'invert(1)' : 'none',
		'color-link-new': '@color-link',
		'color-link-stub': '@color-link',
		'color-link-external': '@color-link',
		'color-link-new--visited': '@color-link--visited'
	} );
};

export const getLessVarsCode = ( vars ) => {
	return Object.keys( vars ).map( ( key ) => {
		return `@${key}: ${vars[ key ]};`;
	} ).join( '\n' );
};

import DEFAULT_SKIN_LESS from './skin.less';

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

/**
 * Generate a ZIP file for a given skin.
 *
 * @param {string} name
 * @param {string} mustache
 * @param {string} less
 * @param {string} js
 * @param {Object} variables
 * @param {Object} options
 */
export function buildSkin( name, mustache, less, js = '', variables = {}, options = {} ) {
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
				'variables.less': getLessVarsCode( variables ),
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

export function getLESSFromTemplate( mustache ) {
	return getComponentLESSRaw(
		Object.keys(
			getTemplatesFromSourceCode( PARTIALS, mustache )
		)
	);
}

function getFeatureStylesheet( key ) {
	return FEATURE_STYLES[ key ] || '';
}

export function getResourceLoaderSkinModuleStylesFromStylesheet( styles ) {
	return Object.keys( getFeaturesFromStyles( styles ) )
		.map( ( key ) => getFeatureStylesheet( key ) )
		.join( '\n' );
}

export { build };
