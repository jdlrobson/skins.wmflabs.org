import { COMPONENT_STYLES } from './starter-template';

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
