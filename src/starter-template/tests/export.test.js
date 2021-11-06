import build from '../export/index';
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

	it( 'smoke test with imports', () => {
		const JS_LIBRARY = 'module.exports = 5;';
		const LESS_CONTENT = `/* ResourceLoaderSkinModule: elements,normalize */
html { color: blue; }`;
		const CSS_CONTENT = 'body { color: red; }';
		const JS_CONTENT = `var e = require( './import.js' );
alert(e);`;
		const TEMPLATE_CONTENT = 'Hello world';

		return build(
			'Complex skin', // name
			// styles
			{
				'skin.less': LESS_CONTENT,
				'skin.css': CSS_CONTENT
			},
			// templates
			{
				skin: TEMPLATE_CONTENT
			},
			{
				'import.js': JS_LIBRARY,
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
			expect( files.length ).toBe( 12 );
			const skinjsonfile = files.filter( ( file ) => file.name === 'ComplexSkin/skin.json' )[ 0 ];
			const skinjson = JSON.parse( skinjsonfile.content );
			const styleModule = skinjson.ResourceModules[ 'skins.complexskin.styles' ];
			expect( styleModule.features ).toStrictEqual(
				{
					elements: true,
					normalize: true
				}
			);
			expect( styleModule.styles ).toStrictEqual(
				[ 'resources/skin.css', 'resources/skin.less' ]
			);
			// In package files make sure skin.js is the main entry point (at top)
			expect( skinjson.ResourceModules[ 'skins.complexskin' ].packageFiles ).toStrictEqual(
				[ 'resources/skin.js', 'resources/import.js' ]
			);
		} );
	} );

	it( 'smoke test failure: no less defined', () => {
		const b = () => build(
			'nojsskin', // name
			// styles
			{},
			// templates
			{}
		);
		expect( b ).toThrow( Error );
	} );

	it( 'smoke test failure: no template defined', () => {
		const b = () => build(
			'nojsskin', // name
			// styles
			{
				'skin.less': '// @todo'
			},
			// templates
			{}
		);
		expect( b ).toThrow( Error );
	} );

	it( 'smoke test build skin without JS - no module or scripts option', () => {
		return build(
			'nojsskin', // name
			// styles
			{
				'skin.less': 'body {}'
			},
			// templates
			{
				skin: 'Hello world'
			},
			// JS
			{},
			[],
			JSZip, // zipper
			function saveAs( content ) {
				return () => Promise.resolve( {
					success: true,
					content
				} );
			}
		).then( ( done ) => {
			const files = done.zip.ls();
			expect( files.length ).toBe( 9 );
			const skinjsonfile = files.filter( ( file ) => file.name === 'Nojsskin/skin.json' )[ 0 ];
			const skinjson = JSON.parse( skinjsonfile.content );
			expect( skinjson.ValidSkinNames.nojsskin.args[ 0 ].scripts ).toStrictEqual( [] );
			expect( skinjson.ResourceModules[ 'skins.nojsskin' ] ).toBe( undefined );
		} );
	} );
} );
