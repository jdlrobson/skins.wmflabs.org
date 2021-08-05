import build from '../src/export';
import JSZip from './mock/JSZip';

describe( 'build', () => {

	it( 'smoke test', () => {
		const LESS_CONTENT = 'body { color: red; }';
		const JS_CONTENT = 'console.log("HELLO");';
		const TEMPLATE_CONTENT = 'Hello world';

		return build(
			'redtextskin', // name
			// styles
			{
				'skin.less': LESS_CONTENT
			},
			// templates
			{
				skin: TEMPLATE_CONTENT
			},
			{
				'skin.js': JS_CONTENT
			}, // scripts
			[
				'redlink'
			], // messages
			JSZip, // zipper
			function saveAs( content ) {
				return () => Promise.resolve( {
					success: true,
					content
				} );
			}
		).then( ( done ) => {
			const files = done.zip.ls();
			expect( files.length ).toBe( 10 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/.eslintrc.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/.stylelintrc.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/.gitignore' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/package.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/skin.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/i18n/en.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/i18n/qqq.json' ).length ).toBe( 1 );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/resources/skin.less' )[ 0 ].content )
				.toBe( LESS_CONTENT );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/resources/skin.js' )[ 0 ].content )
				.toBe( JS_CONTENT );
			expect( files.filter( ( file ) => file.name === 'Redtextskin/templates/skin.mustache' )[ 0 ].content )
				.toBe( TEMPLATE_CONTENT );

			expect( done.saveResult.success ).toBe( true );
		} );

	} );
} );
