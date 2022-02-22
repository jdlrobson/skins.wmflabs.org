import build from './export/index.js';
import FooterList from './components/FooterList.mustache';
import CategoryPlain from './components/CategoryPlain.mustache';
import CompactFooter from './components/CompactFooter.mustache';
import Portlet from './components/Portlet.mustache';
import ContentIndicators from './components/ContentIndicators.mustache';
import Notices from './components/Notices.mustache';
import ContentHeading from './components/ContentHeading.mustache';
import ContentActions from './components/ContentActions.mustache';
import ContentNamespaces from './components/ContentNamespaces.mustache';
import ContentBody from './components/ContentBody.mustache';
import ContentTagline from './components/ContentTagline.mustache';
import Footer from './components/Footer.mustache';
import Logo from './components/Logo.mustache';
import LanguageButton from './components/LanguageButton.mustache';
import Search from './components/Search.mustache';
import WPSearch from './components/WPSearch.mustache';
import Sidebar from './components/Sidebar.mustache';
import Notifications from './components/Notifications.mustache';
import PersonalMenu from './components/PersonalMenu.mustache';
import Languages from './components/Languages.mustache';
import Dropdown from './components/Dropdown.mustache';
import AdminBar from './components/AdminBar.mustache';
import AdminBarHome from './components/AdminBarHome.mustache';
import AdminBarUser from './components/AdminBarUser.mustache';
import AdminBarWithEdit from './components/AdminBarWithEdit.mustache';
import EditBar from './components/EditBar.mustache';
import CategoryPortlet from './components/CategoryPortlet.mustache';
import TableOfContents from './components/TableOfContents.mustache';
import TableOfContentsLine from './components/TableOfContents__line.mustache';

import AdminBarHomeLESS from './components/AdminBarHome.less';
import AdminBarUserLESS from './components/AdminBarUser.less';
import AdminBarWithEditLESS from './components/AdminBar.less';
import AdminBarLESS from './components/AdminBar.less';
import EditBarLESS from './components/EditBar.less';
import PersonalMenuLESS from './components/PersonalMenu.less';
import ContentActionsLESS from './components/ContentActions.less';
import DropdownLESS from './components/Dropdown.less';
import CategoryPlainLESS from './components/CategoryPlain.less';
import ContentNamespacesLESS from './components/ContentNamespaces.less';
import PortletLESS from './components/Portlet.less';
import NotificationsLESS from './components/Notifications.less';
import SidebarLESS from './components/Sidebar.less';
import FooterLESS from './components/Footer.less';
import LogoLESS from './components/Logo.less';
import LanguageButtonLESS from './components/LanguageButton.less';
import SearchLESS from './components/Search.less';
import TableOfContentsLESS from './components/TableOfContents.less';
import { getFeaturesFromStyles, getTemplatesFromSourceCode } from './utils';

export const COMPONENT_STYLES = {
	AdminBarHome: AdminBarHomeLESS,
	AdminBarUser: AdminBarUserLESS,
	AdminBarWithEdit: AdminBarWithEditLESS,
	AdminBar: AdminBarLESS,
	CategoryPlain: CategoryPlainLESS,
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
	Search: SearchLESS,
	TableOfContents: TableOfContentsLESS,
	LanguageButton: LanguageButtonLESS
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
	// eslint-disable-next-line camelcase
	TableOfContents__line: TableOfContentsLine,
	TableOfContents,
	CategoryPlain,
	EditBar,
	LanguageButton,
	CategoryPortlet,
	AdminBar, AdminBarWithEdit, AdminBarUser, AdminBarHome,
	CompactFooter,
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

export const messages = ( templates ) => {
	const msgs = [];
	const extractMessages = ( text ) => {
		const match = text.match( /{{msg-[^}]*}}/g );
		if ( match ) {
			match.forEach( ( result ) => {
				msgs.push( result.replace( '{{msg-', '' ).replace( '}}', '' ) );
			} );
		}
	};
	Object.keys( PARTIALS ).forEach( ( key ) => extractMessages( PARTIALS[ key ] ) );
	Object.keys( templates ).forEach( ( key ) => extractMessages( templates[ key ] ) );
	return msgs;
};

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
			( lessFile ) => `@import '${lessFile}';`
		).join( '\n' );
		mapping[ `${name}.less` ] = `${importStatements}

${COMPONENT_STYLES[ name ]}`;
	} );
	return mapping;
}

import {
	getSkinKeyFromName
} from './export/utils';

/**
 * Generate a ZIP file for a given skin.
 *
 * @param {string} name
 * @param {string} mustache
 * @param {string|Object} less
 * @param {string|Object} js
 * @param {Object} variables
 * @param {Object} options
 * @param {boolean} options.isCSS
 * @param {Object|null} options.skinFeatures
 * @param {Object|null} options.skinOptions to be passed directly to ValidSkinName args
 * @param {Object|null} options.messages
 * @param {Array|null} options.authors
 * @param {Object} options.skinStyles
 * @param {string} options.license License of skin
 */
export function buildSkin( name, mustache, less, js = '', variables = {}, options = {} ) {
	const skinKey = getSkinKeyFromName( name );
	const templates = getTemplatesFromSourceCode( PARTIALS, mustache, skinKey );
	const styles = getComponentLESSFiles( Object.keys( templates ), [
		'mediawiki.skin.variables',
		'variables.less'
	] );
	const isStringModeLESS = typeof less === 'string';
	const isStringModeJS = typeof js === 'string';
	let importStatements = Object.keys( styles )
		.map( ( key ) => `@import '${key}';` ).join( '\n' );

	if ( !options.isCSS ) {
		importStatements += `
@import 'common.less';
`;
	}
	const mainCss = options.isCSS ? 'common.css' : 'common.less';

	let skinFeatures = `/** ${name} */
`;

	if ( options.skinFeatures ) {
		const features = Object.keys( options.skinFeatures )
			// Filter out any that are disabled.
			.filter( ( key ) => options.skinFeatures[ key ] )
			.join( ',' );
		skinFeatures += `/** ResourceLoaderSkinModule: ${features} */
`;
	}

	build(
		name,
		Object.assign(
			styles,
			isStringModeLESS ? {
				[ mainCss ]: less
			} : less,
			{
				'variables.less': `${getLessVarsCode( variables )}
`,
				'skin.less': `${skinFeatures}
@import 'mediawiki.skin.variables.less';
@import 'variables.less';
${importStatements}`
			} ),
		templates,
		isStringModeJS ? {
			'skin.js': js
		} : js,
		messages( templates ),
		options
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

import buildExtension from './export/extension';
export { buildExtension };
