import JSZip from 'jszip';
import FileSaver from './FileSaver.js';
import { getFeaturesFromStyles } from '../utils.js';
import packageJSON from '../_package.json';
import eslintJSON from '../_eslintrc.json';
import stylelintJSON from '../_stylelintrc.json';

const SKINS_LAB_VERSION = '2.0';
const MW_MIN_VERSION = '1.37.0';

function stringifyjson( json ) {
	return JSON.stringify( json, null, 2 );
}

function camelcase( str ) {
	return str.replace( /(?:^\w|[A-Z]|\b\w)/g, function ( word ) {
		return word.toUpperCase();
	} ).replace( /\s+/g, '' );
}

function getFolderNameFromName( name ) {
	return camelcase( name );
}

function getSkinKeyFromName( name ) {
	return getFolderNameFromName( name ).toLowerCase();
}

function addi18n( name, rootfolder ) {
	const TOOL_LINK = `[https://skins.wmflabs.org skins.wmflabs.org v.${SKINS_LAB_VERSION}]`;
	const skinKey = getSkinKeyFromName( name );
	const i18nfolder = rootfolder.folder( 'i18n' );
	const en = {
		[ `skinname-${skinKey}` ]: name,
		[ `${name}-desc` ]: `A skin created by ${TOOL_LINK}`
	};
	const qqq = {
		[ `skinname-${skinKey}` ]: '{{optional}}',
		[ `${skinKey}-desc` ]: `{{desc|what=skin|name=${name}|url=https://www.mediawiki.org/wiki/Skin:${name}}}`
	};
	i18nfolder.file( 'en.json', stringifyjson( en ) );
	i18nfolder.file( 'qqq.json', stringifyjson( qqq ) );
}

/**
 *
 * @param {string} name  e.g. Vector
 * @param {string[]} styles paths
 * @param {string[]} packageFiles path
 * @param {string[]} messages keys used by skin
 * @param {string[]} skinFeatures feature keys used by skin
 * @return {string}
 */
function skinjson( name, styles, packageFiles, messages, skinFeatures ) {
	const folderName = getFolderNameFromName( name );
	const skinKey = getSkinKeyFromName( name );
	const TOOL_LINK = `[https://skins.wmflabs.org skins.wmflabs.org v.${SKINS_LAB_VERSION}]`;

	return stringifyjson(
		{
			name,
			version: '1.0.0',
			namemsg: `skinname-${skinKey}`,
			descriptionmsg: `${skinKey}-skin-desc`,
			url: `https://www.mediawiki.org/wiki/Skin:${folderName}`,
			author: [ `${TOOL_LINK}` ],
			type: 'skin',
			requires: {
				MediaWiki: `>= ${MW_MIN_VERSION}`
			},
			'license-name': 'GPL-2.0-or-later',
			// eslint-disable-next-line camelcase
			manifest_version: 2,
			ValidSkinNames: {
				[ skinKey ]: {
					class: 'SkinMustache',
					args: [
						{
							name: name,
							responsive: true,
							messages: messages,
							styles: [
								'mediawiki.ui.icon',
								'mediawiki.ui.button',
								`skins.${skinKey}.styles`
							],
							scripts: packageFiles.length ? [
								`skins.${skinKey}`
							] : []
						}
					]
				}
			},
			MessagesDirs: {
				[ folderName ]: [ 'i18n' ]
			},
			ResourceFileModulePaths: {
				localBasePath: '',
				remoteSkinPath: folderName
			},
			ResourceModules: {
				[ `skins.${skinKey}.styles` ]: {
					class: 'ResourceLoaderSkinModule',
					features: skinFeatures,
					targets: [ 'desktop', 'mobile' ],
					styles
				},
				[ `skins.${skinKey}` ]: packageFiles.length ? {
					targets: [ 'desktop', 'mobile' ],
					packageFiles
				} : undefined
			}
		}
	);
}

/**
 *
 * @param {string} name (uppercase) of skin e.g. SkinVector
 * @param {Object} styles key is the name of the stylesheet
 *  and the text is its content. the key `skin.less` will be rendered last
 * @param {Object} templates key is the name of the template minus
 * the mustache suffix and the text is its content
 * @param {Object} scripts key is the name of the script file e.g. `skin.js` and the text is its content
 * @param {Array} messages (keys) used by template
 * @param {JSZip} [Zipper] constructor
 * @param {FileSaver} [myFileSaver]
 * @return {Promise}
 */
function build( name, styles, templates, scripts = {}, messages = [], Zipper = JSZip, myFileSaver = FileSaver ) {
	const zip = new Zipper();
	const folderName = getFolderNameFromName( name );
	const rootfolder = zip.folder( folderName );
	const resourcesFolder = rootfolder.folder( 'resources' );
	const templatefolder = rootfolder.folder( 'templates' );
	if ( !styles[ 'skin.less' ] ) { throw new Error( 'skin.less must be defined in styles.' ); }
	if ( !templates.skin ) { throw new Error( '`skin` must be defined in templates.' ); }
	const skinFeatures = getFeaturesFromStyles( styles[ 'skin.less' ] );
	// Create the files in the root folder

	const jsfiles = ( scripts[ 'skin.js' ] ? [ 'resources/skin.js' ] : [] ).concat(
		Object.keys( scripts ).filter( ( scriptFileName ) => scriptFileName !== 'skin.js' )
			.map( ( scriptFileName ) => `resources/${scriptFileName}` )
	);
	rootfolder.file( 'skin.json',
		skinjson(
			name,
			// only `css` files need to be listed in manifest
			// not LESS.
			Object.keys( styles ).filter(
				( styleFileName ) => styleFileName.indexOf( '.less' ) === -1 && styleFileName !== 'skin.less'
			)
				// its in the src folder.
				.map( ( styleFileName ) => `resources/${styleFileName}` )
				.concat( [ 'resources/skin.less' ] ),
			jsfiles,
			messages,
			skinFeatures
		)
	);
	rootfolder.file( 'package.json', stringifyjson( packageJSON ) );
	rootfolder.file( '.eslintrc.json', stringifyjson( eslintJSON ) );
	rootfolder.file( '.stylelintrc.json', stringifyjson( stylelintJSON ) );
	rootfolder.file( '.gitignore', `.eslintcache
node_modules/
` );

	// create styles and script files in `resources` folder
	Object.keys( styles ).forEach( ( filename ) => {
		resourcesFolder.file( filename, styles[ filename ] );
	} );
	Object.keys( scripts ).forEach( ( filename ) => {
		resourcesFolder.file( filename, scripts[ filename ] );
	} );

	// setup templates
	Object.keys( templates ).forEach( ( template ) => {
		templatefolder.file( `${template}.mustache`, templates[ template ] );
	} );

	// setup i18n
	addi18n( name, rootfolder );
	/* images.forEach((image) => {
        imagesfolder.file(image.name, image.text);
    }) */

	// build!
	return zip.generateAsync( { type: 'blob' } )
		.then( ( content ) => {
			const saver = myFileSaver();
			return saver( content, `${folderName}.zip` );
		} ).then( ( saveResult ) => {
			return {
				zip, saveResult
			};
		} );
}

export default build;
