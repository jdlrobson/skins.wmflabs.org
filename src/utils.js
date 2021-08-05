export function getTemplatesFromSourceCode( partials, sourceCode ) {
	let usedPartials = {};
	Object.keys( partials ).filter( ( name ) => {
		// Is the partial in the sourceCode?
		const re = new RegExp( `{{> *${name} *}}` );
		return !!sourceCode.match( re );
	} ).forEach( ( key ) => {
		const others = Object.keys( getTemplatesFromSourceCode( partials, partials[key] ) );
		usedPartials[ key ] = partials[ key ];
		others.forEach((key) => {
			usedPartials[ key ] = partials[ key ];
		} );
	} );

	return Object.assign( usedPartials, {
		skin: sourceCode
	} );
}
