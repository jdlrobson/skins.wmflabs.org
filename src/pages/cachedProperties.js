
/**
 * @param {string} namespace
 * @param {Object} defaults
 */
function getCachedProperties( namespace, defaults ) {
	const props = {};
	Object.keys( ( defaults ) ).forEach( ( key ) => {
		let val = localStorage.getItem( `${namespace}-${key}` );
		if ( val === 'true' ) {
			val = true;
		} else if ( val === 'false' ) {
			val = false;
		} else if ( val !== null ) {
			if ( val.indexOf( '{' ) === 0 ) {
				try {
					val = JSON.parse( val );
				} catch ( e ) {
					val = defaults[ key ];
				}
			}
		} else {
			val = defaults[ key ];
		}
		props[ key ] = val;
	} );
	return props;
}

/**
 * @param {Object} defaults
 * @param {Function} callback
 */
function clearCachedProperties( defaults, callback ) {
	Object.keys( defaults ).forEach( ( key ) => {
		localStorage.removeItem( `${namespace}-${key}` );
		callback( key );
	} );
}

/**
 * @param {string} namespace
 * @param {string} key
 * @param {string|Object} value
 */
function setCachedProperty( namespace, key, value ) {
	const valueToSave = typeof value === 'object' ? JSON.stringify( value ) : value;
	localStorage.setItem( `${namespace}-${key}`, valueToSave );
}

export {
	clearCachedProperties,
	getCachedProperties,
	setCachedProperty
};
