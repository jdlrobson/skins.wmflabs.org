import { getTemplatesFromSourceCode } from '../src/utils';

describe( 'utils', () => {

	it.each( [
		[
			'No partials',
			{
				Partial: 'Code'
			},
			[ 'skin' ]
		],
		[
			// not valid Mustache
			'{ { > Partial } }',
			{
				Partial: 'Code'
			},
			[ 'skin' ]
		],
		[
			'{{>Partial}}',
			{
				Partial: 'Code'
			},
			[ 'Partial', 'skin' ]
		],
		[
			'{{> Partial }}',
			{
				Partial: 'Code'
			},
			[ 'Partial', 'skin' ]
		],
		[
			'A {{> Partial }} and some more partial {{>Foo }}',
			{
				Partial: 'Code',
				Foo: 'Another partial'
			},
			[ 'Foo', 'Partial', 'skin' ]
		],
		[
			'A {{> Partial }} but this is not a partial its a value {{ Foo }}',
			{
				Partial: 'Code',
				Foo: 'Another partial'
			},
			[ 'Partial', 'skin' ]
		],
		[
			'A {{> PartialInception }} is an interesting use case',
			{
				Partial: "It worked",
				AnotherPartialInception: '{{>Partial}}',
				PartialInception: '{{>AnotherPartialInception}}',
				Foo: 'Another partial'
			},
			[ 'AnotherPartialInception', 'Partial', 'PartialInception', 'skin' ]
		]

	] )( 'getTemplatesFromSourceCode', ( sourceCode, templates, expected ) => {
		const usedTemplates = getTemplatesFromSourceCode( templates, sourceCode );
		const usedTemplateNames = Object.keys( usedTemplates ).sort();

		expect( usedTemplates.skin ).toEqual( sourceCode ); // test
		expect( usedTemplateNames ).toEqual( expected ); // test
	} );
} );
