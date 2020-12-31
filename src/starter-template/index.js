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
const PersonalMenu = fs.readFileSync(`${__dirname}/PersonalMenu.mustache`).toString();
const Languages = fs.readFileSync(`${__dirname}/Languages.mustache`).toString();

export const PARTIALS = {
    Languages,
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

export const DEFAULT_SKIN_MUSTACHE = fs.readFileSync(`${__dirname}/skin.mustache`).toString();
export const DEFAULT_SKIN_CSS = fs.readFileSync(`${__dirname}/skin.css`).toString();
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
