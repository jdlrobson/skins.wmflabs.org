import JSZip from 'jszip';
import FileSaver from './FileSaver.js';

import { stringifyjson,
	getFolderNameFromName,
	getSkinKeyFromName,
	addDevTools
} from './utils';

function aliasFileName( folderName ) {
	return `${folderName}.alias.php`;
}

function makeServiceWiring( folderName ) {
	return `
<?php
use MediaWiki\\MediaWikiServices;

return [
	'${folderName}.Config' => static function ( MediaWikiServices $services ) {
		return $services->getService( 'ConfigFactory' )
				->makeConfig( ${folderName.toLowerCase()} );
	},
];
`;
}

function makeAliasFile( folderName, specialPages ) {

	const aliases = {};

	specialPages.forEach( ( name ) => {
		aliases[ name ] = [ name ];
	} );

	return `<?php
/**
 * Aliases for ${folderName} extension
 *
 * @file
 * @ingroup Extensions
 */

$specialPageAliases = [];

/** English (English) */
$specialPageAliases['en'] = [
	${
	Object.keys( aliases ).map( ( specialName ) => {
		return `'${specialName}' => ${
			JSON.stringify( aliases[ specialName ] )
		},`;
	} ).join( '\n' )
}
];
`;
}

function extjson( folderName ) {
	const extensionKey = getSkinKeyFromName( folderName );
	return stringifyjson( {
		name: folderName,
		author: [],
		url: `https://www.mediawiki.org/wiki/Extension:${folderName}`,
		descriptionmsg: `${extensionKey}-desc`,
		requires: {
			MediaWiki: '>= 1.38.0'
		},
		ConfigRegistry: {
			[ extensionKey ]: 'GlobalVarConfig::newInstance'
		},
		SpecialPages: {
			/* @todo */
		},
		APIModules: {
			/* @todo */
		},
		MessagesDirs: {
			[ extensionKey ]: [
				'i18n'
			]
		},
		ExtensionMessagesFiles: {
			[ `${folderName}Alias` ]: `${aliasFileName( folderName )}`
		},
		AutoloadNamespaces: {
			[ `${folderName}\\` ]: 'includes/'
		},
		ResourceModules: {
		},
		ResourceFileModulePaths: {
			localBasePath: '',
			remoteExtPath: `${folderName}`
		},
		Hooks: {

		},
		config: {

		},
		DefaultUserOptions: {},
		ServiceWiringFiles: [
			'includes/ServiceWiring.php'
		],
		// eslint-disable-next-line camelcase
		manifest_version: 2
	} );
}

function addi18n( rootfolder, name ) {
	const i18nfolder = rootfolder.folder( 'i18n' );
	const en = {
		[ `${name.toLowerCase()}-desc` ]: 'A new extension.'
	};
	const qqq = {};
	i18nfolder.file( 'en.json', stringifyjson( en ) );
	i18nfolder.file( 'qqq.json', stringifyjson( qqq ) );
}

/**
 *
 * @param {string} name
 * @param {Object} options
 * @return {Promise}
 */
export default function buildExtension( name, options = {} ) {
	const Zipper = options.Zipper || JSZip;
	const myFileSaver = options.FileSaver || FileSaver;
	const zip = new Zipper();
	const folderName = getFolderNameFromName( name );
	const rootfolder = zip.folder( folderName );
	rootfolder.file( 'extension.json',
		extjson( folderName )
	);
	addi18n( rootfolder, name );
	addDevTools( rootfolder );
	/* const resourcesFolder = */rootfolder.folder( 'resources' );
	const includesFolder = rootfolder.folder( 'includes' );
	rootfolder.file(
		aliasFileName( name ),
		makeAliasFile( name, [] )
	);
	includesFolder.file(
		'ServiceWiring.php',
		makeServiceWiring( name )
	);

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
