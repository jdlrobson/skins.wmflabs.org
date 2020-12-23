export const HOST = 'https://skins-demo.wmflabs.org/';
export const TEST_ARTICLES = [
    { title: 'Help:Sample_page', name: 'Sample page' },
    { title: 'Ipsum_Lorem', name: 'Ipsum Lorem' },
    { title: 'Rube Goldberg machine', name: 'Rube Goldberg machine' }
];
export const CATEGORY_SKINS = 'Category:Stable_skins';
export const CATEGORY_BETA_SKINS = 'Category:Beta_status_skins';
export const CATEGORY_UNMAINTAINED_SKINS = 'Category:Unmaintained_skins';
export const CATEGORY_EXPERIMENTAL_SKINS = 'Category:Experimental_skins';

export const HIDDEN_SKINS = [
    // advertising skins
    'wima',
    'vectorad',
    'colognebanner',
    'example' // just an example
];

export const SKIN_DEPENDS_ON_EXTENSIONS = [
    'chameleon',
    'aether',
    'bluespicecalumma'
];

export const SKIN_KEY_SPECIAL_CASES = {
    minervaneue: 'minerva',
    eucopyrightcampaignskin: 'eucopyrightcampaign',
    scratchwikiskin: 'scratchwiki2'
};

// Replace with page images once enabled on mediawiki.org for skin namespace
export const SCREENSHOTS = {
    eucopyrightcampaign: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/EUCopyrightCampaign_Skin_for_MediaWiki.png',
    jony: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Skin_Jony.png',
    amethyst: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Screenshot_of_MediaWiki_Amethyst_Skin.png',
    modernskylight: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Skin_Modern_Skylight_Screenshot.png/2880px-Skin_Modern_Skylight_Screenshot.png',
    mediawikibootstrap: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Mediwiki-bootstrap-screenshot.png',
    dgraph: 'https://upload.wikimedia.org/wikipedia/mediawiki/thumb/9/94/Dgraph_homepage.png/700px-Dgraph_homepage.png',
    scratchwiki2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/MediaWiki_Screenshot_of_ScratchWiki_2_skin.png/1600px-MediaWiki_Screenshot_of_ScratchWiki_2_skin.png',
    simpletext: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Screenshot_of_SimpleText_MediaWiki_skin.png',
    purecss: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/PureCss_Screenshot.png',
    cavendish: 'https://upload.wikimedia.org/wikipedia/mediawiki/thumb/1/13/Cavendish-Skin.jpg/440px-Cavendish-Skin.jpg',
    aether: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Mediawiki-skin-aether.png',
    anisa: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Anisa_screenshot.png',
    athena: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Athena_skin_1.png/440px-Athena_skin_1.png',
    erudite: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Erudite_skin.png/440px-Erudite_skin.png',
    webplatform: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Screen_of_MediaWiki_skin_WebPlatform.png',
    woogleshades: 'https://upload.wikimedia.org/wikipedia/commons/1/10/WoOgLeShades.png',
    wikimediaapiportal: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Screen_Shot_of_MediaWiki_Skin-WikimediaApiPortal.png',
    darkcosmos: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Perfect_dark_theme_design.jpg',
    femiwiki: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Skin-Femiwiki.png',
    liberty: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Screenshot-skin-liberty.png',
    citizen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Screen_Shot_of_MediaWiki_Citizen_skin.png/480px-Screen_Shot_of_MediaWiki_Citizen_skin.png',
    refreshed: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Refreshed4Big.png',
    dusktodawn: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/DuskToDawn.png',
    medik: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Skin_Medik.png/480px-Skin_Medik.png',
    darkvector: 'https://upload.wikimedia.org/wikipedia/commons/8/84/DarkVector.png',
    gamepress: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Gamepress_Skin_Screenshot.png/700px-Gamepress_Skin_Screenshot.png',
    bluespicecalumma: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Screen_Shot_of_Blue_Spice_Calumma_Skin.png/600px-Screen_Shot_of_Blue_Spice_Calumma_Skin.png',
    foreground: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/20151215_1.2.0_Screenshot_MediaWiki_Foreground_skin.png/750px-20151215_1.2.0_Screenshot_MediaWiki_Foreground_skin.png',
    chameleon: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/ChameleonSkin.png',
    pivot: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/MediaWiki_Pivot_skin_-_screenshot.png',
    tweeki: 'https://upload.wikimedia.org/wikipedia/mediawiki/0/05/Tweeki-screenshot-main.png',
    vector: `${HOST}//images/7/78/Screenshot_of_Modern_Vector.png`,
    hassomecolours: `${HOST}/images/3/3f/Screenshot_of_HasSomeColors.png`,
    'woOgLeShades': `${HOST}/images/b/b8/Screenshot_of_WoogleShades_Skin.png`,
    poncho: `${HOST}/images/8/8b/Screenshot_of_Poncho_Skin.png`
};
