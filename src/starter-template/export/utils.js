import packageJSON from './assets/_package.json';
import eslintJSON from './assets/_eslintrc.json';
import stylelintJSON from './assets/_stylelintrc.json';

function camelcase( str ) {
	return str.replace( /(?:^\w|[A-Z]|\b\w)/g, function ( word ) {
		return word.toUpperCase();
	} ).replace( /\s+/g, '' );
}

export function stringifyjson( json ) {
	return `${JSON.stringify( json, null, '\t' )}
`;
}

export function getFolderNameFromName( name ) {
	return camelcase( name );
}

export function getSkinKeyFromName( name ) {
	return getFolderNameFromName( name ).toLowerCase();
}

export function addDevTools( rootfolder ) {
	rootfolder.file( 'package.json', stringifyjson( packageJSON ) );
	rootfolder.file( '.eslintrc.json', stringifyjson( eslintJSON ) );
	rootfolder.file( '.stylelintrc.json', stringifyjson( stylelintJSON ) );
	rootfolder.file( '.gitignore', `.eslintcache
node_modules/
` );
}
