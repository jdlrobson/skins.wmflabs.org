import JSZip from 'jszip';
import FileSaver from './FileSaver.js';
import { getFeaturesFromStyles } from '../utils.js';
const SKINS_LAB_VERSION = '2.0';
const MW_MIN_VERSION = '1.38.0';

import { stringifyjson,
	addDevTools,
	getFolderNameFromName,
	getSkinKeyFromName
} from './utils';

/**
 * @typedef {Object} Folder
 * @property {Function} file
 */
/**
 *
 * @param {string} name
 * @param {Folder} rootfolder
 * @param {Object} messages
 * @param {Array} authors
 */
function addi18n( name, rootfolder, messages = {}, authors = [] ) {
	const TOOL_LINK = `[https://skins.wmflabs.org skins.wmflabs.org v.${SKINS_LAB_VERSION}]`;
	const skinKey = getSkinKeyFromName( name );
	const i18nfolder = rootfolder.folder( 'i18n' );
	const metadata = {
		authors
	};
	const en = Object.assign( {
		'@metadata': metadata,
		[ `skinname-${skinKey}` ]: name,
		[ `${skinKey}-desc` ]: `A skin created by ${TOOL_LINK}`
	}, messages.en || {} );
	const qqq = Object.assign( {
		'@metadata': metadata,
		[ `skinname-${skinKey}` ]: '{{optional}}',
		[ `${skinKey}-desc` ]: `{{desc|what=skin|name=${name}|url=https://www.mediawiki.org/wiki/Skin:${name}}}`
	}, messages.qqq || {} );
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
 * @param {Object} skinOptions for populating ValidSkinNames args
 * @param {string} license of skin
 * @param {Array} authors of skin
 * @param {Object} skinStyles
 * @param {boolean} toc whether to include in article.
 * @return {Object}
 */
function skinjson(
	name, styles, packageFiles, messages, skinFeatures, skinOptions, license,
	authors, skinStyles, toc
) {
	const folderName = getFolderNameFromName( name );
	const skinKey = getSkinKeyFromName( name );
	const TOOL_LINK = `[https://skins.wmflabs.org skins.wmflabs.org v.${SKINS_LAB_VERSION}]`;
	const author = authors || [ `${TOOL_LINK}` ];

	return (
		{
			name,
			version: '1.0.0',
			author,
			url: `https://www.mediawiki.org/wiki/Skin:${folderName}`,
			descriptionmsg: `${skinKey}-skin-desc`,
			namemsg: `skinname-${skinKey}`,
			'license-name': license,
			type: 'skin',
			requires: {
				MediaWiki: `>= ${MW_MIN_VERSION}`
			},
			ValidSkinNames: {
				[ skinKey ]: {
					class: 'SkinMustache',
					args: [
						Object.assign( {
							name: skinKey,
							responsive: true,
							toc,
							messages,
							styles: [
								'mediawiki.ui.icon',
								'mediawiki.ui.button',
								`skins.${skinKey}.styles`
							],
							scripts: packageFiles.length ? [
								`skins.${skinKey}`
							] : []
						}, skinOptions )
					]
				}
			},
			MessagesDirs: {
				[ folderName ]: [ 'i18n' ]
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
			},
			ResourceFileModulePaths: {
				localBasePath: '',
				remoteSkinPath: folderName
			},
			ResourceModuleSkinStyles: {
				[ skinKey ]: skinStyles
			},
			// eslint-disable-next-line camelcase
			manifest_version: 2
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
 * @param {Object} options
 * @return {Promise}
 */
function build( name, styles, templates, scripts = {}, messages = [], options = {} ) {
	const Zipper = options.Zipper || JSZip;
	const myFileSaver = options.CustomFileSaver || FileSaver;
	const skinOptions = options.skinOptions || {};
	const license = options.license;
	const messageObj = options.messages || {};
	const authors = options.authors;
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

	const skinKey = getSkinKeyFromName( name );
	const skinMessages = Array.from(
		new Set(
			messages.map(
				( msg ) => msg.replace( 'skinname-', `${skinKey}-` )
			)
		)
	);
	const skinJSON = (
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
			skinMessages,
			skinFeatures,
			skinOptions,
			license,
			authors,
			options.skinStyles,
			// If no reference to data-toc in master template,
			// assume toc should be included.
			templates.skin.indexOf( '#data-toc' ) === -1
		)
	);

	rootfolder.file( 'skin.json', stringifyjson( skinJSON ) );
	addDevTools( rootfolder );

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
	messageObj.qqq = messageObj.qqq || {};
	const ourMessages = {
		'no-categories': 'Message to show when no categories available'
	};
	skinMessages.forEach( ( key ) => {
		const lookup = key.split( '-' ).slice( 1 ).join( '-' );
		const ours = ourMessages[ lookup ];
		if ( ours ) {
			messageObj.qqq[ key ] = ours;
		}
	} );

	addi18n( name, rootfolder, messageObj, authors || [ '...' ] );
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
