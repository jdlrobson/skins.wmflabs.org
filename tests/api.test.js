import api from '../src/api';
import mockFetch from './mock/fetch.js';

describe( 'api', () => {
	beforeEach( () => {
		global.fetch = jest.fn(mockFetch);
	} );

	it( 'getSkinJSON: logged in users', () => {
		return api.getSkinJSON( 'TestLoggedIn', false ).then( ( json ) => {
			expect( json ).toStrictEqual( { logged_in: true } );
		} );
	} );

	it( 'getSkinJSON: anon users', () => {
		return api.getSkinJSON( 'TestLoggedIn', true ).then( ( json ) => {
			expect( json ).toStrictEqual( { logged_in: false } );
		} );
	} );

	it( 'fetchSkins', () => {
		return api.fetchSkins().then(( json ) => {
			expect( json.skins[0].name ).toStrictEqual( 'Vector' );
		});
	} );

	it( 'getSkinKeyFromName', () => {
		const key = api.getSkinKeyFromName( 'Minerva Neue');
		expect(key).toBe('minerva');
	} );

	it( 'fetchSkinInfo', () => {
		return api.fetchSkinInfo('vector').then((json) => {
			expect( json.name ).toStrictEqual( 'Vector' );
			expect( json.compatible ).toStrictEqual( true );
		});
	} );
} );
