import JSZip from 'jszip';
import saveAs from './FileSaver';

const VERSION = '1.0';
const TOOL_LINK = `[https://skins.wmflabs.org skins.wmflabs.org v.${VERSION}]`;

const DEFAULT_FEATURES = {
    "normalize": true,
    "elements": true,
    "content": true,
    "interface": true,
    "toc": true
};

function stringifyjson(json) {
    return JSON.stringify(json, null, 2);
}

function addi18n(name, rootfolder) {
    const skinKey = name.toLowerCase();
    const i18nfolder = rootfolder.folder('i18n');
    const en = {
        [`skinname-${skinKey}`]: name,
        [`${name}-desc`]: `A skin created by ${TOOL_LINK}`
    };
    const qqq = {
        [`skinname-${skinKey}`]: '{{optional}}',
        [`${skinKey}-desc`]: `{{desc|what=skin|name=${name}|url=https://www.mediawiki.org/wiki/Skin:${name}}}`
    }
    i18nfolder.file('en.json', stringifyjson(en));
    i18nfolder.file('qqq.json', stringifyjson(qqq));
}

/**
 * 
 * @param {string} name  e.g. Vector
 * @param {string[]} styles paths
 * @param {string[]} packageFiles path
 * @param {string[]} message keys used by skin
 */
function skinjson(name, styles, packageFiles, messages = []) {
    const skinKey = name.toLowerCase();

    return stringifyjson(
        {
            name,
            namemsg: `skinname-${skinKey}`,
            descriptionmsg: `${skinKey}-skin-desc`,
            url: `https://www.mediawiki.org/wiki/Skin:${name}`,
            author: [ `${TOOL_LINK}` ],
            type: 'skin',
            requires: {
                MediaWiki: '>= 1.36.0'
            },
            'manifest_version': 2,
            ValidSkinNames: {
                [skinKey]: {
                    "class": 'SkinMustache',
                    "args": [
                        {
                            "name": name,
                            "templateDirectory": `skins/${name}/templates/`,
                            "messages": messages,
                            "styles": [
                                `skins.${skinKey}.styles`
                            ],
                            "scripts": [
                                `skins.${skinKey}`
                            ]
                        }
                    ]
                }
            },
            MessagesDirs: {
                [name]: [ 'i18n']
            },
            ResourceFileModulePaths: {
                localBasePath: '',
                remoteSkinPath: name
            },
            ResourceModules: {
                [`skins.${skinKey}.styles`]: {
                    class: "ResourceLoaderSkinModule",
                    features: DEFAULT_FEATURES,
                    styles
                },
                [`skins.${skinKey}`]: {
                    packageFiles
                }
            }
        }
    );
}

/**
 * 
 * @param {string} name (uppercase) of skin e.g. SkinVector
 * @param {Object} styles key is the name of the stylesheet
 *  and the text is its content. the key `skin.css` will be rendered last
 * @param {Object} templates key is the name of the template minus
 * the mustache suffix and the text is its content
 * @param {Object} scripts key is the name of the script file e.g. `skin.js` and the text is its content
 */
function build(name, styles, templates, scripts = {}, messages = {}) {
    const zip = new JSZip();
    const rootfolder = zip.folder(name);
    const resourcesFolder = rootfolder.folder('resources');
    const templatefolder = rootfolder.folder('templates');
    if(!styles['skin.css']) throw new Error('skin.css must be defined in styles.')
    if(!templates['skin']) throw new Error('`skin` must be defined in templates.')

    // Create the files in the root folder

    rootfolder.file('skin.json',
        skinjson(
            name,
            // only `css` files need to be listed in manifest
            // not LESS.
            Object.keys(styles).filter((name) => name.indexOf('.css') > -1 && name !== 'skin.css')
                // its in the src folder.
                .map((name) => `resources/${name}`)
                .concat(['resources/skin.css']),
            Object.keys(scripts).filter((name) => name !== 'skin.js').
                map((name) => `resources/${name}`)
                .concat(scripts['skin.js'] ? ['resources/skin.js'] : []),
            [
                'msg-sitetitle'
            ]
        )
    );

    // create styles and script files in `resources` folder
    Object.keys(styles).forEach((filename) => {
        resourcesFolder.file(filename, styles[filename]);
    });
    Object.keys(scripts).forEach((filename) => {
        resourcesFolder.file(filename, scripts[filename]);
    });

    // setup templates
    Object.keys(templates).forEach((template) => {
        templatefolder.file(`${template}.mustache`, templates[template]);
    });

    // setup i18n
    addi18n(name, rootfolder);
    /*images.forEach((image) => {
        imagesfolder.file(image.name, image.text);
    })*/

    // build!
    zip.generateAsync({ type: 'blob' } )
        .then((content) => saveAs(content, `${name}.zip`))
}

export default build;