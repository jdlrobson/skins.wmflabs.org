const skins = {};

import { CATEGORY_SKINS, HOST,
	SKIN_KEY_SPECIAL_CASES, CATEGORY_BETA_SKINS,
	CATEGORY_EXPERIMENTAL_SKINS,
	CATEGORY_INCOMPATIBLE_WITH_MEDIAWIKI_MASTER,
	CATEGORY_ADDITIONAL_REQUIREMENTS,
	CATEGORY_REQUIRE_MODIFICATION,
	CATEGORY_UNMAINTAINED_SKINS } from './constants';

const cacheForFetches = {};

function cachedJSONFetch( url ) {
	if ( cacheForFetches[ url ] ) {
		return cacheForFetches[ url ];
	} else {
		cacheForFetches[ url ] = fetch( url ).then( ( r ) => r.json() );
		return cachedJSONFetch( url );
	}
}

function getSkinJSON( title, isAnon ) {
	return fetch( `${HOST}/wiki/${title}?useskin=skinjson&testuser=${isAnon ? 0 : 1}` )
		.then( ( r ) => r.json() );
}

function getDemoEnabledSkins() {
	return cachedJSONFetch( `${HOST}w/rest.php/v1/skins` )
		.then( ( data ) => {
			Object.keys( data.skins ).forEach( ( key ) => {
				data.skins[ key ].author = (
					data.skins[ key ].author || [ 'unknown' ]
				).map( ( author ) => {
					if ( author.indexOf( '[' ) === 0 ) {
						if ( author.indexOf( '|' ) > -1 ) {
							return author.split( '|' )[ 1 ].replace( ']]', '' );
						} else {
							return author.split( ' ' ).slice( 1 ).join( ' ' )
								.replace( ']', '' );
						}
					} else {
						return author;
					}
				} );
			} );
			return data.skins;
		} );
}

function getSkinKeyFromName( name ) {
	let key = name.replace( /[ !]/g, '' )
		.toLowerCase()
		.replace( /\//, '-' );
	if ( SKIN_KEY_SPECIAL_CASES[ key ] ) {
		key = SKIN_KEY_SPECIAL_CASES[ key ];
	}
	return key;
}

/**
 * @param {string} category
 * @param {Object} installedSkins mapping skin keys to info
 * @param {string} [gcmcontinue]
 * @param {Array} [pages]
 * @return {Promise}
 */
function queryMediaWikiSkins( category, installedSkins, gcmcontinue = '', pages = [] ) {
	const compatible = Object.keys( installedSkins );
	// clcategory is used to check if the skin is in "CATEGORY_ADDITIONAL_REQUIREMENTS"
	// cllimit set at 50 the maximum value for page images.
	const MAX = 50;
	const url = `https://www.mediawiki.org
/w/api.php?action=query
&format=json&origin=*&prop=pageviews%7Cpageimages%7Ccategories&formatversion=2&origin=*
&clcategories=${CATEGORY_ADDITIONAL_REQUIREMENTS}%7C${CATEGORY_REQUIRE_MODIFICATION}%7C${CATEGORY_INCOMPATIBLE_WITH_MEDIAWIKI_MASTER}
&cllimit=${MAX}
&piprop=thumbnail&pithumbsize=400&pilimit=${MAX}
&pvipmetric=pageviews&pvipdays=60
&generator=categorymembers&gcmlimit=${MAX}&gcmtitle=${encodeURIComponent( category )}&gcmnamespace=106
&${gcmcontinue}`.replace( /\n/g, '' );

	return cachedJSONFetch( url ).then( ( r ) => {
		if ( r ) {
			if ( r.query && r.query.pages ) {
				const newPages = r.query.pages;
				pages = pages.concat(
					newPages.map( ( p ) => {
						const pv = p.pageviews || {};
						const name = p.title.split( ':' )[ 1 ];
						const key = getSkinKeyFromName( name );
						const src = p.thumbnail ? p.thumbnail.source : undefined;
						const isCompatible = compatible.includes( key );
						const categoryTitles = ( p.categories || [] ).map( ( c ) => c.title.replace( / /g, '_' ) );
						const hasDependencies = categoryTitles.includes( CATEGORY_ADDITIONAL_REQUIREMENTS );
						const requiresModification = categoryTitles.includes( CATEGORY_REQUIRE_MODIFICATION );
						const mightBreak = categoryTitles.includes( CATEGORY_INCOMPATIBLE_WITH_MEDIAWIKI_MASTER );
						const experimental = CATEGORY_EXPERIMENTAL_SKINS === category;
						const beta = CATEGORY_BETA_SKINS === category;
						const unmaintained = CATEGORY_UNMAINTAINED_SKINS === category;

						const score = () => {
							let s = 0;
							if ( mightBreak ) { s--; }
							if ( src ) { s++; }
							if ( isCompatible ) { s++; } else { s--; }
							if ( !hasDependencies ) { s++; } else if ( !requiresModification ) { s++; } else { s--; }
							if ( beta ) { s--; }
							if ( unmaintained ) { s -= 100; }
							if ( !experimental ) { s++; }
							return s;
						};

						return Object.assign( p, {
							key,
							src,
							name,
							experimental,
							compatible: isCompatible,
							beta,
							mightBreak,
							unmaintained,
							requiresModification,
							hasDependencies: hasDependencies || requiresModification,
							stable: true,
							score: score(),
							pageviews: Object.keys( pv )
								.map( ( pvkey ) => pv[ pvkey ] )
								.reduce( ( count, total = 0 ) => total + count, 0 )
						}, ( installedSkins[ key ] || {} ) );
					} ).filter( ( p ) => {
						const isSkinVariant = p.title.indexOf( '/' ) > -1;
						const skinKey = p.title.toLowerCase().replace( /\//, '-' ).replace( 'skin:', '' );
						return isSkinVariant ?
							compatible.indexOf( skinKey ) > -1 :
							p.title.indexOf( 'Skin:' ) > -1 && p.title !== 'Skin:Example';
					} )
				);
			}

			if ( r.continue ) {
				const continueKey = Object.keys( r.continue ).map( ( key ) => `${key}=${r.continue[ key ]}` ).join( '&' );
				return queryMediaWikiSkins( category, installedSkins, continueKey, pages );
			} else {
				return pages;
			}
		}
	} );
}

/**
 * @param {Object} compatible skin keys mapped to info
 * @return {Promise}
 */
function queryMediaWikiAllSkins( compatible ) {
	return Promise.all( [
		queryMediaWikiSkins( CATEGORY_SKINS, compatible ),
		queryMediaWikiSkins( CATEGORY_BETA_SKINS, compatible ),
		queryMediaWikiSkins( CATEGORY_EXPERIMENTAL_SKINS, compatible )
	] ).then( ( ...args ) => args[ 0 ].length > 1 ?
		args[ 0 ][ 0 ].concat.apply( args[ 0 ][ 0 ], args[ 0 ].slice( 1 ) ) :
		args[ 0 ][ 0 ]
	);
}

function getSkinIndexRemote() {
	if ( Object.keys( skins ) > 0 ) {
		return Promise.resolve( skins );
	}
	return getDemoEnabledSkins().then( ( compatible ) => queryMediaWikiAllSkins( compatible ) );
}

function populateSkinIndexAfter( skinPages ) {
	skinPages.forEach( ( skin ) => {
		const isVariant = skin.name.indexOf( '/' ) > -1;
		const parentSkin = isVariant ? skin.name.split( '/' )[ 0 ] : null;
		skins[ skin.key ] = Object.assign( skin, {
			parentSkinUrl: isVariant ? `https://mediawiki.org/wiki/Skin:${parentSkin}` : null,
			parentSkinKey: isVariant ? getSkinKeyFromName( parentSkin ) : null,
			isVariant
		} );
	} );
	// with skins fully populated run again.
	Object.keys( skins ).forEach( ( skinKey ) => {
		const skin = skins[ skinKey ];
		if ( skin.isVariant ) {
			const parentSkin = skins[ skin.parentSkinKey ];
			// Copy across these keys.
			if ( parentSkin ) {
				[ 'src', 'compatible', 'unmaintained',
					'experimental', 'stable', 'beta', 'hasDependencies', 'mightBreak', 'score'
				].forEach( ( copyKey ) => {
					skins[ skinKey ][ copyKey ] = parentSkin[ copyKey ];
				} );
			}
		}
	} );
	return skins;
}

function cleanMwHTML( str ) {
	return str.replace(
		// &lt;tvar name=1&gt;...&lt;/tvar&gt;
		/&lt;tvar name=[^&]*&gt;([^&]*)&lt;\/tvar&gt;/,
		'$1'
	).replace(
		/(&lt;\/translate&gt;|&lt;translate&gt;)/gi,
		''
	).replace(
		// external link tvars
		/\[&lt;tvar\|[^&]*&gt;[^&]*&lt;\/&gt; ([^\]]*)\]/g,
		'$1'
	).replace(
		// [[&lt;tvar name=3&gt;Special:MyLanguage/Manual:Skins&lt;/tvar&gt;|skin]]
		/\[\[&lt;tvar name=[^&]*&gt;[^&]*&lt;\/tvar&gt;\|([^\]]*)\]\]/g,
		'$1'
	).replace(
		// standard link tvars
		/\[\[&lt;tvar\|[^&]*&gt;[^&]*&lt;\/&gt;\|([^\]]*)\]\]/g,
		'$1'
	).replace(
		/&lt;tvar\|[^&]*&gt;([^&]*)&lt;\/&gt;/g,
		'$1'
	).replace(
		// [[ ]]
		/\[\[[^&]*&lt;\/&gt;\|([^\]]*)\]\]*/g,
		'$1'
	).replace(
		// &lt;tvar name=1&gt;<b>Lakeus</b>&lt;/tvar&gt;
		/&lt;tvar name=[^&]*&gt;([^&]*)&lt;\/tvar&gt;/,
		'$1'
	);
}

function fetchSkinInfo( key ) {
	return getSkinIndex().then( ( compatibleSkins ) => {
		const isCompatible = compatibleSkins[ key ] && compatibleSkins[ key ].compatible;
		const skin = skins[ key ] || false;
		if ( !skin ) {
			return Promise.reject();
		}
		const title = `Skin%3A${skin.name}`;
		const revisionsQuery = 'rvdir=newer&rvlimit=1&rvprop=timestamp';
		return Promise.all( [
			// https://www.mediawiki.org/wiki/Special:ApiSandbox#action=query&format=json&prop=categories%7Cextracts%7Cextlinks&titles=Skin%3AMinerva_Neue&redirects=1&formatversion=2&cllimit=max&exsentences=3&exlimit=max&exintro=1&explaintext=1&ellimit=max
			cachedJSONFetch( `https://www.mediawiki.org/w/api.php?action=query&format=json&${revisionsQuery}&prop=revisions%7Ccategories%7Cextlinks&redirects=1&formatversion=2&cllimit=max&origin=*&titles=${title}` ),
			cachedJSONFetch( `https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=${title}&section=0` )
		] )
			.then( ( responseObjects ) => {
				const result = responseObjects[ 0 ];
				const template = document.createElement( 'template' );
				const doc = template.content;
				const parsedResult = responseObjects[ 1 ].parse;
				const html = parsedResult.text[ '*' ];
				template.innerHTML = cleanMwHTML( html );
				const firstP = doc.querySelectorAll( '.mw-parser-output > p' )[ 0 ];
				const links = [];
				let summary, created,
					stable, categories;

				try {
					const p = result.query.pages;
					const info = p[ 0 ];
					summary = firstP ? firstP.textContent : 'No skin information available';
					categories = ( p.categories || [] ).map( ( c ) => c.title );
					links.push( {
						text: 'View on mediawiki.org',
						href: info.title ? `https://mediawiki.org/wiki/${info.title}` : ''
					} );
					const firstRevision = info.revisions[ 0 ];
					if ( skin.parentSkinUrl ) {
						links.push( {
							text: 'View parent skin on MediaWiki.org',
							href: skin.parentSkinUrl
						} );
					}
					created = firstRevision ? firstRevision.timestamp : null;
					const extlinks = ( info.extlinks || [] ).concat( parsedResult.iwlinks || [] )
						.map( ( link ) => link.url );

					extlinks.forEach( ( url ) => {
						if ( url.match( /github\.com/ ) && url.match( /\.git/ ) ) {
							links.push( {
								text: 'View on github',
								href: url
							} );
						}
						if ( url.match( /gerrit\.wikimedia.org\/g\// ) && !url.match( /(log\/master)/ ) ) {
							links.push( {
								text: 'View on gerrit',
								href: url
							} );
						}
						if ( url.match( /kde\.org/ ) ) {
							links.push( {
								text: 'View on kde',
								href: url
							} );
						}
						if ( url.match( /gitlab\.com/ ) && url.match( /\.git/ ) ) {
							links.push( {
								text: 'View on gitlab',
								href: url
							} );
						}
						if ( url.match( /bitbucket.org\// ) && url.match( /\.git/ ) ) {
							links.push( {
								text: 'View on bitbucket',
								href: url
							} );
						}

						if ( url.match( /sourceforge.net\// ) && !url.match( /download/ ) ) {
							links.push( {
								text: 'View on sourceforge',
								href: url
							} );
						}
					} );
				} catch ( e ) {
				}
				return Object.assign( {
					links,
					created,
					isCompatible,
					summary, stable, categories
				}, skin );
			} );
	} );
}

function fetchSkinsRemote() {
	return getSkinIndex().then( () => {
		return {
			skins: Object.keys( skins ).map( ( key ) => {
				return Object.assign( {}, skins[ key ] );
			} )
		};
	} );
}

function fetchSkins() {
	return new Promise( ( resolve ) => {
		cachedJSONFetch( '/data/skins.json' ).then( ( r ) => {
			resolve( r );
		}, () => {
			fetchSkinsRemote().then( ( json ) => resolve( json ) );
		} );
	} );
}

function getSkinIndex() {
	return new Promise( ( resolve ) => {
		cachedJSONFetch( '/data/index.json' ).then( ( r ) => {
			resolve( r );
		}, () => {
			getSkinIndexRemote().then( ( json ) => resolve( json ) );
		} );
	} ).then( ( r ) => populateSkinIndexAfter( r ) );
}

export default {
	getSkinIndexRemote,
	fetchSkinsRemote,
	getSkinKeyFromName,
	getSkinJSON,
	fetchSkinInfo,
	fetchSkins
};
