import { COMPONENT_STYLES, DEFAULT_FEATURES,
	FEATURE_STYLES } from './starter-template';

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

/**
 *
 * @param {string[]} componentNames name array
 * @return {Array} of components with styles.
 */
function getComponentLESSFileNames( componentNames ) {
	return componentNames.filter(
		// Only if one was declared.
		( key ) => !!COMPONENT_STYLES[ key ]
	);
}

/**
 *
 * @param {string[]} componentNames name array
 * @return {Array} of components with styles.
 */
export function getComponentLESSRaw( componentNames ) {
	return getComponentLESSFileNames( componentNames ).map(
		( key ) => COMPONENT_STYLES[ key ]
	).join( '\n' );
}

/**
 *
 * @param {string[]} componentNames name array
 * @param {string[]} imports (e.g. ['variables.less'])
 * @return {Object} of components with styles.
 */
export function getComponentLESSFiles( componentNames, imports ) {
	const mapping = {};
	getComponentLESSFileNames( componentNames ).forEach( ( name ) => {
		const importStatements = imports.map(
			( lessFile ) => `@import "${lessFile}";`
		).join( '\n' );
		mapping[ `${name}.less` ] = `
${importStatements}
${COMPONENT_STYLES[ name ]}
`;
	} );
	return mapping;
}

export function getFeaturesFromStyles( styles ) {
	const match = styles.match( /\/\*+ +ResourceLoaderSkinModule: ([^*]*) *[*]+/ );
	const result = {};
	if ( match && match[ 1 ] ) {
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

function getFeatureStylesheet( key ) {
	return FEATURE_STYLES[key] || '';
}


export function getResourceLoaderSkinModuleStylesFromStylesheet( styles ) {
	return Object.keys( getFeaturesFromStyles( styles ) )
		.map( (key) => getFeatureStylesheet( key ) )
		.join('\n');
}
