import fetch from 'node-fetch';
import apiModule from './src/api.js';
import fs from 'fs';

const api = apiModule.default || apiModule;
global.fetch = fetch;
api.fetchSkinsRemote().then( ( json ) => {
	if ( json.skins ) {
		json.modified = new Date();
		fs.writeFileSync( 'data/skins.json', JSON.stringify( json ) );
	} else {
		console.error( 'response in unknown form' );
	}
} );

api.getSkinIndexRemote().then( ( json ) => {
	if( Object.keys( json ).length > 80 ) {
		json.modified = new Date();
		fs.writeFileSync( 'data/index.json', JSON.stringify( json ) );
	} else {
		console.error( 'response in unknown form' );
	}
} );
