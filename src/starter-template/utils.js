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
		Object.keys( DEFAULT_FEATURES ).forEach( ( key ) => {
			result[ key ] = false;
		} );
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

/**
 * @param {string} template
 * @param {string} skinKey
 * @return {string}
 */
function localizeTemplate( template, skinKey ) {
	return template.replace( /msg-skinname-/g, `msg-${skinKey}-` );
}

export function getTemplatesFromSourceCode( partials, sourceCode, skinKey, templateName = 's' ) {
	const usedPartials = {};
	Object.keys( partials ).filter( ( name ) => {
		// Is the partial in the sourceCode?
		const re = new RegExp( `{{> *${name} *}}` );
		return !!sourceCode.match( re ) &&
			// avoid recursion.
			templateName !== name;
	} ).forEach( ( key ) => {
		const others = Object.keys(
			getTemplatesFromSourceCode( partials, partials[ key ], skinKey, key )
		);
		usedPartials[ key ] = localizeTemplate( partials[ key ], skinKey );
		others.forEach( ( otherKey ) => {
			if ( otherKey === 'skin' ) {
				return; // not a partial.
			}
			const standardTemplate = partials[ otherKey ];
			const localizedTemplate = skinKey ?
				localizeTemplate( standardTemplate, skinKey ) :
				standardTemplate;
			usedPartials[ otherKey ] = localizedTemplate;
		} );
	} );

	return Object.assign( usedPartials, {
		skin: sourceCode
	} );
}
