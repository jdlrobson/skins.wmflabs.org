import api from '../src/api';
import mockFetch from './mock/fetch.js';

describe( 'api', () => {
	beforeEach( () => {
		global.fetch = jest.fn( mockFetch );
	} );

	it( 'getSkinJSON: logged in users', () => api.getSkinJSON( 'TestLoggedIn', false ).then( ( json ) => {
		expect( json ).toStrictEqual( { loggedIn: true } );
	} ) );

	it( 'getSkinJSON: anon users', () => api.getSkinJSON( 'TestLoggedIn', true ).then( ( json ) => {
		expect( json ).toStrictEqual( { loggedIn: false } );
	} ) );

	it( 'fetchSkins', () => api.fetchSkins().then( ( json ) => {
		expect( json.skins[ 0 ].name ).toStrictEqual( 'Vector' );
	} ) );

	it( 'getSkinKeyFromName', () => {
		const key = api.getSkinKeyFromName( 'Minerva Neue' );
		expect( key ).toBe( 'minerva' );
	} );

	it( 'fetchSkinInfo', () => api.fetchSkinInfo( 'vector' ).then( ( json ) => {
		expect( json.name ).toStrictEqual( 'Vector' );
		expect( json.compatible ).toStrictEqual( true );
	} ) );
} );
