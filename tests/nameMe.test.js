import nameMe from '../src/nameMe';

describe( 'nameMe', () => {

	it( 'names', () => {
		let name = nameMe();
		for ( let i = 0; i < 100; i++ ) {
			name = nameMe();
		}
		expect( typeof name ).toBe( 'string' );
	} );
} );
