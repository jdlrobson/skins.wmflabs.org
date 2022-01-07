const skins = {};

import { CATEGORY_SKINS,
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
	return fetch( `https://skins-demo.wmflabs.org/wiki/${title}?useskin=skinjson&testuser=${isAnon ? 0 : 1}` )
		.then( ( r ) => r.json() );
}

function getDemoEnabledSkins() {
	return cachedJSONFetch( 'https://skins-demo.wmflabs.org/w/api.php?origin=*&action=query&format=json&meta=siteinfo&siprop=skins' )
		.then( ( data ) => {
			const compatible = data.query.skins.map( ( skin ) => skin.code );
			return compatible;
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
 * @param {Array} compatible skin keys
 * @param {string} [gcmcontinue]
 * @param {Array} [pages]
 * @return {Promise}
 */
function queryMediaWikiSkins( category, compatible, gcmcontinue = '', pages = [] ) {
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
&gcmcontinue=${gcmcontinue}`.replace( /\n/g, '' );

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
						} );
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
				const continueKey = Object.keys( r.continue ).map( ( key ) => `${key}=${r.continue[key]}` ).join( '&' );
				return queryMediaWikiSkins( category, compatible, continueKey, pages );
			} else {
				return pages;
			}
		}
	} );
}

/**
 * @param {Array} compatible skin keys
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

function getSkinIndex() {
	if ( Object.keys( skins ) > 0 ) {
		return Promise.resolve( skins );
	}
	return getDemoEnabledSkins().then( ( compatible ) => queryMediaWikiAllSkins( compatible ) )
		.then( ( skinPages ) => {
			skinPages.forEach( ( skin ) => {
				skins[ skin.key ] = skin;
			} );
			return skins;
		} );
}
function cleanMwHTML( str ) {
	return str.replace(
		// &lt;tvar name=1&gt;...&lt;/tvar&gt;
		/&lt;tvar name\=[^&]*&gt;([^&]*)&lt;\/tvar&gt;/,
		'$1'
	).replace(
		/(&lt;\/translate&gt;|&lt;translate&gt;)/gi,
		'',
	).replace(
		// external link tvars
		/\[&lt;tvar\|[^&]*&gt;[^&]*&lt;\/&gt; ([^\]]*)\]/g,
		'$1'
	).replace(
		// [[&lt;tvar name=3&gt;Special:MyLanguage/Manual:Skins&lt;/tvar&gt;|skin]]
		/\[\[&lt;tvar name\=[^&]*&gt;[^&]*&lt;\/tvar&gt;\|([^\]]*)\]\]/g,
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
		//&lt;tvar name=1&gt;<b>Lakeus</b>&lt;/tvar&gt;
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
		const revisionsQuery = `rvdir=newer&rvlimit=1&rvprop=timestamp`;
		return Promise.all( [
			// https://www.mediawiki.org/wiki/Special:ApiSandbox#action=query&format=json&prop=categories%7Cextracts%7Cextlinks&titles=Skin%3AMinerva_Neue&redirects=1&formatversion=2&cllimit=max&exsentences=3&exlimit=max&exintro=1&explaintext=1&ellimit=max
			cachedJSONFetch( `https://www.mediawiki.org/w/api.php?action=query&format=json&${revisionsQuery}&prop=revisions%7Ccategories%7Cextlinks&redirects=1&formatversion=2&cllimit=max&origin=*&titles=${title}` ),
			cachedJSONFetch( `https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=${title}&section=0` )
		] )
			.then( ( responseObjects ) => {
				const result = responseObjects[0];
				const template = document.createElement( 'template' );
				const doc = template.content;
				const html = responseObjects[1].parse.text['*'];
				template.innerHTML = cleanMwHTML( html );
				const firstP = doc.querySelectorAll( '.mw-parser-output > p' )[ 0 ];
				let author = '';
				doc.querySelectorAll( '.infobox tr' ).forEach((row) => {
					let field;
					row.querySelectorAll('td').forEach((td, i) => {
						if ( i === 0 ) {
							field = td.textContent.trim().toLowerCase();
						} else if ( i === 1 ) {
							if ( field === 'author(s)' ) {
								author = td.textContent.trim();
							}
						}
					});
				});
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
					if ( skin.name.indexOf( '/' ) > -1 ) {
						links.push( {
							text: 'View parent skin on MediaWiki.org',
							href: `https://mediawiki.org/wiki/Skin:${skin.name.split( '/' )[ 0 ]}`
						} );
					}
					created = firstRevision ? firstRevision.timestamp : null;
					( info.extlinks || [] ).map( ( link ) => link.url ).forEach( ( url ) => {
						if ( url.match( /https:\/\/github.com/ ) && url.match( /\.git/ ) ) {
							links.push( {
								text: 'View on github',
								href: url
							} );
						}
						if ( url.match( /https:\/\/gerrit.wikimedia.org\/g\// ) && !url.match( /(\+log\/master)/ ) ) {
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
					author,
					summary, stable, categories
				}, skin );
			} );
	} );
}

function fetchSkins() {
	return getSkinIndex().then( () => {
		return {
			skins: Object.keys( skins ).map( ( key ) => {
				return skins[ key ];
			} )
		};
	} );
}

export default {
	getSkinKeyFromName,
	getSkinJSON,
	fetchSkinInfo,
	fetchSkins
};
