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

// sync with resources/src/mediawiki.less/mediawiki.skin.defaults.less in mediawiki/core
export const LESS_GLOBAL_VARS = {
    'width-breakpoint-mobile': '320px',
    'width-breakpoint-tablet': '720px',
    'width-breakpoint-desktop': '1000px'
};

export const LESS_RENDER_OPTIONS = {
    strictUnits: true,
    globalVars: LESS_GLOBAL_VARS
};
