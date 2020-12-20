const skins = {};
import { HOST, CATEGORY_SKINS, HIDDEN_SKINS, SKIN_COMPATIBILITY_PROBLEMS,
    SKIN_KEY_SPECIAL_CASES,
    SKIN_DEPENDS_ON_EXTENSIONS, SCREENSHOTS } from './constants';

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
                            const key = SKIN_KEY_SPECIAL_CASES[name] || name.replace(/ /g, '').toLowerCase();

                            return Object.assign(p, {
                                key,
                                src: SCREENSHOTS[key] || `${HOST}w/skins/${name.replace(/ /g, '')}/screenshots/1280x800.png`,
                                name,
                                compatible: !SKIN_COMPATIBILITY_PROBLEMS.includes(key),
                                hasDependencies: SKIN_DEPENDS_ON_EXTENSIONS.includes(key),
                                stable: category === CATEGORY_SKINS,
                                pageviews: Object.keys(pv).map(key=>pv[key]).reduce((count, total=0) => total+count, 0)
                            })
                        }).filter((p) => {
                            return !HIDDEN_SKINS.includes(p.title.replace('Skin:', '').toLowerCase())
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
    return queryMediaWikiSkins( CATEGORY_SKINS );
}

function getSkinIndex() {
    if (Object.keys(skins) > 0) {
        return Promise.resolve(skins);
    }
    return queryMediaWikiAllSkins()
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
                let summary, github, gerrit, stable, categories, bitbucket, gitlab;
                try {
                    const p = result.query.pages;
                    const info = p[0];
                    categories = (p.categories || []).map((c) => c.title);
                    summary = info.extract;
                    info.extlinks.map(link => link.url).forEach((url) => {
                        console.log(url);
                        if(url.match(/https:\/\/github.com/) && url.match(/\.git/)) {
                            github = url;
                        }
                        if(url.match(/https:\/\/gerrit.wikimedia.org\/g\//) && !url.match(/(\+log\/master)/)) {
                            gerrit = url;
                        }

                        if(url.match(/gitlab\.com/) && url.match(/\.git/)) {
                            gitlab = url;
                        }
                        if(url.match(/bitbucket.org\//) && url.match(/\.git/)) {
                            bitbucket = url;
                        }
                    });
                } catch (e) {
                    summary = 'No skin information available';
                }
                return Object.assign({
                    bitbucket,
                    summary, gerrit, github, stable, categories, gitlab
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