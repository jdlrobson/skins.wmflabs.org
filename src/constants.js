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

export const DEFAULT_SKIN_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII= ';

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
    'scratchwikiskin2',
    'bluespicecalumma'
];

export const SKIN_KEY_SPECIAL_CASES = {
    minervaneue: 'minerva',
    2018: 's2018',
    eucopyrightcampaignskin: 'eucopyrightcampaign',
    scratchwikiskin: 'scratchwikiskin2'
};

// Replace with page images once enabled on mediawiki.org for skin namespace
export const SCREENSHOTS = {
    s2018: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Screen_Shot_of_2018_skin_taken_in_January_2021.png',
    onyx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Screen_Shot_of_Onyx_skin.png/700px-Screen_Shot_of_Onyx_skin.png',
    greystuff: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Greystuff_skin_screenshot.png/600px-Greystuff_skin_screenshot.png',
    splash: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Splash_skin_screenshot.png/800px-Splash_skin_screenshot.png',
    deskmessmirrored: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Screenshot_of_DeskMessMirrored_skin.jpg/700px-Screenshot_of_DeskMessMirrored_skin.jpg',
    nimbus: 'https://upload.wikimedia.org/wikipedia/mediawiki/7/78/Nimbus_skin_-_registered_user.png',
    tempo: 'https://upload.wikimedia.org/wikipedia/mediawiki/thumb/9/99/Tempo-skin.png/700px-Tempo-skin.png',
    truglass: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Truglass_MediaWiki_skin.png/700px-Truglass_MediaWiki_skin.png',
    dusk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Skin_Dusk.png/700px-Skin_Dusk.png',
    mask: 'https://upload.wikimedia.org/wikipedia/mediawiki/thumb/d/d4/Mask_skin_screenshot.png/600px-Mask_skin_screenshot.png',
    bouquet: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/BouquetSkin.png/700px-BouquetSkin.png',
    nostalgia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Dantman-Skin-nostalgia.png/440px-Dantman-Skin-nostalgia.png',
    metrolook: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Metrolook_skin.png',
    apex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Apex_skin_-_example_screenshot.png/700px-Apex_skin_-_example_screenshot.png',
    bluesky: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Skin_BlueSky.png',
    cosmos: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Cosmos_skin.png/700px-Cosmos_skin.png',
    p2wiki: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Screenshot_of_P2Wiki_skin_for_MediaWiki.png',
    schulenburg: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Screen_Shot_of_Schulenburg_skin_for_MediaWiki.png',
    wptouch: 'https://upload.wikimedia.org/wikipedia/mediawiki/e/ed/WPtouch.png',
    eucopyrightcampaign: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/EUCopyrightCampaign_Skin_for_MediaWiki.png',
    amethyst: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Screenshot_of_MediaWiki_Amethyst_Skin.png',
    mediawikibootstrap: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Mediwiki-bootstrap-screenshot.png',
    scratchwikiskin2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/MediaWiki_Screenshot_of_ScratchWiki_2_skin.png/1600px-MediaWiki_Screenshot_of_ScratchWiki_2_skin.png',
    simpletext: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Screenshot_of_SimpleText_MediaWiki_skin.png',
    aether: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Mediawiki-skin-aether.png',
    anisa: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Anisa_screenshot.png',
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
    foreground: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/20151215_1.2.0_Screenshot_MediaWiki_Foreground_skin.png/750px-20151215_1.2.0_Screenshot_MediaWiki_Foreground_skin.png',
    chameleon: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/ChameleonSkin.png',
    pivot: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/MediaWiki_Pivot_skin_-_screenshot.png',
    hassomecolours: `${HOST}/images/3/3f/Screenshot_of_HasSomeColors.png`,
    'woOgLeShades': `${HOST}/images/b/b8/Screenshot_of_WoogleShades_Skin.png`
};
