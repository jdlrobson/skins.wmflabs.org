import fetch from 'node-fetch';
import api from './src/api.js';
import fs from 'fs';

global.fetch = fetch;
api.default.fetchSkinsRemote().then( ( json ) => {
	if ( json.skins ) {
		json.modified = new Date();
		fs.writeFileSync( 'data/skins.json', JSON.stringify( json ) );
	} else {
		console.error( 'response in unknown form' );
	}
} );
