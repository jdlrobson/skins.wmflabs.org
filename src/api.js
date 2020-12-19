const skins = {};
import { HOST } from './constants';
const screenshots = {
    vector: `${HOST}//images/7/78/Screenshot_of_Modern_Vector.png`,
    hassomecolours: `${HOST}/images/3/3f/Screenshot_of_HasSomeColors.png`,
    'woOgLeShades': `${HOST}/images/b/b8/Screenshot_of_WoogleShades_Skin.png`,
    poncho: `${HOST}/images/8/8b/Screenshot_of_Poncho_Skin.png`
};

function fetchLabs() {
    if (Object.keys(skins) > 0) {
        return Promise.resolve(skins);
    }
    return fetch(`${HOST}/w/api.php?format=json&formatversion=2&origin=*&action=parse&format=json&page=MediaWiki%3ASkins`)
        .then((r) => r.json())
        .then((r) => {
            const node = document.createElement('div');
            node.innerHTML = r.parse.text;
            Array.from(node.querySelector('table').querySelectorAll('tr')).slice(1).forEach((tr) => {
                const tds = Array.from(tr.querySelectorAll('td'));
                const key = tds[0].textContent.trim();
                const name = tds[1].textContent.trim();
                console.log(key);
                skins[key] = {
                    key,
                    name,
                    src: screenshots[key] || `${HOST}/w/skins/${name.replace(/\[.*\]$/g, '')}/screenshots/1280x800.png`
                };
            })
        })
}
function fetchSkinInfo( key ) {
    return fetchLabs().then(() => {
        return Promise.resolve( skins[key] );
    });
}

function fetchSkins() {
    return fetchLabs().then(() => {
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