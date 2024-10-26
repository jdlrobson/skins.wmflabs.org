/* global __dirname */
import fs from 'fs';

function getMock( name ) {
	return JSON.parse( fs.readFileSync( `${ __dirname }/data/${ name }.json` ).toString() );
}

export default ( url ) => new Promise( ( resolve ) => {
	let data;
	if ( url.match( /meta=siteinfo&siprop=skins/ ) ) {
		data = getMock( 'siteinfo' );
	} else if ( url.match( /TestLoggedIn\?useskin=skinjson&testuser=1/ ) ) {
		data = { loggedIn: true };
	} else if ( url.match( /TestLoggedIn\?useskin=skinjson&testuser=0/ ) ) {
		data = { loggedIn: false };
	} else if ( url.match( /gcmtitle=Category%3AStable_skins/ ) ) {
		data = getMock( 'stable' );
	} else if ( url.match( /gcmtitle=Category%3ABeta_status_skins/ ) ) {
		data = getMock( 'beta' );
	} else if ( url.match( /gcmtitle=Category%3AExperimental_skins/ ) ) {
		data = getMock( 'experimental' );
	} else if ( url.match( /action=parse&format=json&origin=*/ ) ) {
		data = getMock( 'parse' );
	} else if ( url.match( /gcmtitle=Category%3AUnmaintained_skins/ ) ) {
		data = getMock( 'unmaintained' );
	} else if ( url.match( /&titles=Skin%3AVector/ ) ) {
		data = getMock( 'vector' );
	} else if ( url.match( /rest.php\/v1\/skins$/ ) ) {
		data = getMock( 'skins' );
	} else {
		throw new Error( `Unstubbed URL: ${ url }` );
	}
	resolve( {
		json: () => Promise.resolve( data )
	} );
} );
