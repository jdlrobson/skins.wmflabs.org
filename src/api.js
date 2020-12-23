let compatible = [];
const skins = {};
import DEFAULT_SKIN_IMAGE from '../assets/noscreen.png';

import { HOST, CATEGORY_SKINS, HIDDEN_SKINS,
    SKIN_KEY_SPECIAL_CASES, CATEGORY_BETA_SKINS,
    CATEGORY_EXPERIMENTAL_SKINS,
    CATEGORY_UNMAINTAINED_SKINS,
    CATEGORY_UNKNOWN_STATUS_SKINS,
    SKIN_DEPENDS_ON_EXTENSIONS, SCREENSHOTS } from './constants';

function getDemoEnabledSkins() {
    if(compatible.length) {
        return Promise.resolve(compatible);
    }
    return fetch('https://skins-demo.wmflabs.org/w/api.php?origin=*&action=query&format=json&meta=siteinfo&siprop=skins')
        .then((r) => r.json())
        .then((data) => {
            compatible = data.query.skins.map((skin) => skin.code);
        });
}

function queryMediaWikiSkins( category, gcmcontinue = '', pages = [] ) {
    return fetch(`https://www.mediawiki.org/w/api.php?action=query&format=json&origin=*&prop=pageviews&generator=categorymembers&formatversion=2&pvipmetric=pageviews&pvipdays=7&gcmlimit=max&gcmtitle=${encodeURIComponent(category)}&gcmnamespace=106&origin=*&gcmcontinue=${gcmcontinue}`)
        .then((r) => r.json())
        .then((r) => {
            if (r) {
                if ( r.query && r.query.pages ) {
                    const newPages = r.query.pages;
                    pages = pages.concat(
                        newPages.map((p) => {
                            const pv = p.pageviews || {};
                            const name = p.title.split(':')[1];
                            let key =  name.replace(/ /g, '').toLowerCase();
                            if(SKIN_KEY_SPECIAL_CASES[key]) {
                                key = SKIN_KEY_SPECIAL_CASES[key];
                            }
                            const isCompatible = compatible.includes(key);

                            return Object.assign(p, {
                                key,
                                src: SCREENSHOTS[key] ||
                                    (isCompatible ? `${HOST}w/skins/${name.replace(/ /g, '')}/screenshots/1280x800.png` : DEFAULT_SKIN_IMAGE),
                                name,
                                experimental: [ CATEGORY_EXPERIMENTAL_SKINS,
                                    CATEGORY_UNKNOWN_STATUS_SKINS,
                                    CATEGORY_UNMAINTAINED_SKINS
                                ].includes(category),
                                compatible: isCompatible,
                                hasDependencies: SKIN_DEPENDS_ON_EXTENSIONS.includes(key),
                                stable: true,
                                pageviews: Object.keys(pv).map(key=>pv[key]).reduce((count, total=0) => total+count, 0)
                            })
                        }).filter((p) => {
                            return !HIDDEN_SKINS.includes(p.key)
                                && p.title.indexOf( '/' ) === -1 && p.title.indexOf('Skin:') > -1;
                        })
                    );
                }

                if ( r.continue && r.continue.gcmcontinue ) {
                    return queryMediaWikiSkins( category, r.continue.gcmcontinue, pages );
                } else {
                    return pages;
                }
            }
        })
}

function queryMediaWikiAllSkins() {
    return Promise.all( [
        queryMediaWikiSkins( CATEGORY_SKINS ),
        queryMediaWikiSkins( CATEGORY_BETA_SKINS ),
        queryMediaWikiSkins( CATEGORY_UNMAINTAINED_SKINS ),
        queryMediaWikiSkins( CATEGORY_EXPERIMENTAL_SKINS ),
        queryMediaWikiSkins( CATEGORY_UNKNOWN_STATUS_SKINS )
    ] ).then(([a,b,c,d,e]) => a.concat(b).concat(c).concat(d).concat(e));
}

function getSkinIndex() {
    if (Object.keys(skins) > 0) {
        return Promise.resolve(skins);
    }
    return getDemoEnabledSkins().then(() =>queryMediaWikiAllSkins())
        .then((skinPages) => {
            skinPages.forEach((skin) => {
                skins[skin.key] = skin;
            });
            return skins;
        });
}
function fetchSkinInfo( key ) {
    return getSkinIndex().then(() => {
        const skin = skins[key] || false;
        if(!skin) {
            return Promise.reject();
        }
        // https://www.mediawiki.org/wiki/Special:ApiSandbox#action=query&format=json&prop=categories%7Cextracts%7Cextlinks&titles=Skin%3AMinerva_Neue&redirects=1&formatversion=2&cllimit=max&exsentences=3&exlimit=max&exintro=1&explaintext=1&ellimit=max
        return fetch(`https://www.mediawiki.org/w/api.php?action=query&format=json&prop=categories%7Cextracts%7Cextlinks&redirects=1&formatversion=2&cllimit=max&exsentences=3&exlimit=max&exintro=1&explaintext=1&ellimit=max&origin=*&titles=Skin%3A${skin.name}`)
            .then((r) => r.json())
            .then((result) => {
                let summary, links = [],
                    stable, categories;
                try {
                    const p = result.query.pages;
                    const info = p[0];
                    categories = (p.categories || []).map((c) => c.title);
                    summary = info.extract;
                    links.push({
                        text: 'View on mediawiki.org',
                        href: info.title ? `https://mediawiki.org/wiki/${info.title}` : ''
                    });
                    info.extlinks.map(link => link.url).forEach((url) => {
                        console.log(url);
                        if(url.match(/https:\/\/github.com/) && url.match(/\.git/)) {
                            links.push( {
                                text: 'View on github',
                                href: url
                            } )
                        }
                        if(url.match(/https:\/\/gerrit.wikimedia.org\/g\//) && !url.match(/(\+log\/master)/)) {
                            links.push( {
                                text: 'View on gerrit',
                                href: url
                            } )
                        }
                        if(url.match(/kde\.org/)) {
                            links.push( {
                                text: 'View on kde',
                                href: url
                            } )
                        }
                        if(url.match(/gitlab\.com/) && url.match(/\.git/)) {
                            links.push( {
                                text: 'View on gitlab',
                                href: url
                            } )
                        }
                        if(url.match(/bitbucket.org\//) && url.match(/\.git/)) {
                            links.push( {
                                text: 'View on bitbucket',
                                href: url
                            } )
                        }

                        if(url.match(/sourceforge.net\//) && !url.match(/download/)) {
                            links.push( {
                                text: 'View on sourceforge',
                                href: url
                            } )
                        }
                    });
                } catch (e) {
                    summary = 'No skin information available';
                }
                return Object.assign({
                    links,
                    summary, stable, categories
                }, skin);
            });
    });
}

function fetchSkins() {
    return getSkinIndex().then(() => {
        return {
            skins: Object.keys(skins).map((key) => {
                return skins[key];
            })
        };
    } );
}

export default {
    fetchSkinInfo,
    fetchSkins
};