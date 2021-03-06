import fs from 'fs';

const FooterList = fs.readFileSync(`${__dirname}/FooterList.mustache`).toString();
const Portlet = fs.readFileSync(`${__dirname}/Portlet.mustache`).toString();
const ContentIndicators = fs.readFileSync(`${__dirname}/ContentIndicators.mustache`).toString();
const Notices = fs.readFileSync(`${__dirname}/Notices.mustache`).toString();
const ContentHeading = fs.readFileSync(`${__dirname}/ContentHeading.mustache`).toString();
const ContentActions = fs.readFileSync(`${__dirname}/ContentActions.mustache`).toString();
const ContentNamespaces = fs.readFileSync(`${__dirname}/ContentNamespaces.mustache`).toString();
const ContentBody = fs.readFileSync(`${__dirname}/ContentBody.mustache`).toString();
const ContentTagline = fs.readFileSync(`${__dirname}/ContentTagline.mustache`).toString();
const Footer = fs.readFileSync(`${__dirname}/Footer.mustache`).toString();
const Logo = fs.readFileSync(`${__dirname}/Logo.mustache`).toString();
const Search = fs.readFileSync(`${__dirname}/Search.mustache`).toString();
const Sidebar = fs.readFileSync(`${__dirname}/Sidebar.mustache`).toString();
const Notifications = fs.readFileSync(`${__dirname}/Notifications.mustache`).toString();
const PersonalMenu = fs.readFileSync(`${__dirname}/PersonalMenu.mustache`).toString();
const Languages = fs.readFileSync(`${__dirname}/Languages.mustache`).toString();

export const PARTIALS = {
    Languages,
    Notifications,
    PersonalMenu,
    Footer,
    Logo,
    Search,
    Sidebar,
    FooterList,
    ContentHeading,
    ContentActions,
    ContentNamespaces,
    ContentTagline,
    ContentBody,
    Notices,
    ContentIndicators,
    Portlet
};

export const messages = () => {
    const msgs = [];
    Object.keys(PARTIALS).forEach((key) => {
        const text = PARTIALS[key];
        const match = text.match(/{{msg-[^}]*}}/g);
        if(match) {
            match.forEach((result) => {
                console.log('m', result);
                msgs.push(result.replace('{{msg-', '').replace('}}', ''));
            });
        }
    });
    return msgs;
}
export const DEFAULT_SKIN_MUSTACHE = fs.readFileSync(`${__dirname}/skin.mustache`).toString();

export const randomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export const getLessVars = () => {
    const vars = {
        'background-color-base': randomColor(),
        'background-color-article': 'white',
        'color-base': '#54595d',
        'color-gray': '#a2a9b1',
        'color-gray-2': '#eaecf0',
        'color-link': '#0645ad',
        'color-link--visited': '#0b0080',
        'font-family': "'Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI','Oxygen','Ubuntu','Cantarell','Helvetica Neue',sans-serif"
    };
    return Object.keys(vars).map((key) => {
        return `@${key}: ${vars[key]};`;
    }).join('\n');
}

const DEFAULT_SKIN_LESS = fs.readFileSync(`${__dirname}/skin.less`).toString();

export const generateStylesheetLESS = () => {
    return `/* Variables */
${getLessVars()}

/* Styles */
${DEFAULT_SKIN_LESS}
`;

};

export const SCRIPTS = `
<script>
document.body.addEventListener('click', function (ev) {
    var parent = ev.target;
    while(parent !== ev.currentTarget) {
        if(parent.tagName === 'A' && parent.getAttribute('href')) {
            ev.preventDefault();
            return;
        }
        parent = parent.parentNode;
    }
});
</script>
`;
