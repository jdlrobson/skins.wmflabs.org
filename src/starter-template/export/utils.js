function camelcase( str ) {
	return str.replace( /(?:^\w|[A-Z]|\b\w)/g, function ( word ) {
		return word.toUpperCase();
	} ).replace( /\s+/g, '' );
}

export function stringifyjson( json ) {
	return JSON.stringify( json, null, 2 );
}

export function getFolderNameFromName( name ) {
	return camelcase( name );
}

export function getSkinKeyFromName( name ) {
	return getFolderNameFromName( name ).toLowerCase();
}
