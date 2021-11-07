export const DEFAULT_FEATURES = {
	normalize: true,
	elements: true,
	'content-tables': true,
	'content-links': true,
	'content-media': true,
	'content-links-external': false,
	'interface-message-box': true,
	'interface-category': true,
	toc: true
};

export function getFeaturesFromStyles( styles ) {
	const match = styles.match( /\/\*+ +ResourceLoaderSkinModule: ([^*]*) *[*]+/ );
	const result = {};
	if ( match && match[ 1 ] ) {
		Object.keys(DEFAULT_FEATURES).forEach((key) => {
			result[key] = false;
		});
		match[ 1 ].split( ',' ).map( ( a ) => a.trim() ).forEach( ( key ) => {
			if ( DEFAULT_FEATURES[ key ] !== undefined ) {
				result[ key ] = true;
			}
		} );
		return result;
	} else {
		return DEFAULT_FEATURES;
	}
}

export function getTemplatesFromSourceCode( partials, sourceCode ) {
	const usedPartials = {};
	Object.keys( partials ).filter( ( name ) => {
		// Is the partial in the sourceCode?
		const re = new RegExp( `{{> *${name} *}}` );
		return !!sourceCode.match( re );
	} ).forEach( ( key ) => {
		const others = Object.keys( getTemplatesFromSourceCode( partials, partials[ key ] ) );
		usedPartials[ key ] = partials[ key ];
		others.forEach( ( otherKey ) => {
			usedPartials[ otherKey ] = partials[ otherKey ];
		} );
	} );

	return Object.assign( usedPartials, {
		skin: sourceCode
	} );
}
