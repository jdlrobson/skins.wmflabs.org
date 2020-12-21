import fs from 'fs';

const FooterList = fs.readFileSync(`${__dirname}/FooterList.mustache`).toString();
const Portlet = fs.readFileSync(`${__dirname}/Portlet.mustache`).toString();
const Indicators = fs.readFileSync(`${__dirname}/Indicators.mustache`).toString();
const Notices = fs.readFileSync(`${__dirname}/Notices.mustache`).toString();
const ArticleHeader = fs.readFileSync(`${__dirname}/ArticleHeader.mustache`).toString();
const Footer = fs.readFileSync(`${__dirname}/Footer.mustache`).toString();
const Logo = fs.readFileSync(`${__dirname}/Logo.mustache`).toString();
const Search = fs.readFileSync(`${__dirname}/Search.mustache`).toString();
const Sidebar = fs.readFileSync(`${__dirname}/Sidebar.mustache`).toString();

export const PARTIALS = {
    Footer,
    Logo,
    Search,
    Sidebar,
    FooterList,
    ArticleHeader,
    Notices,
    Indicators,
    Portlet
};

export const DEFAULT_SKIN_MUSTACHE = fs.readFileSync(`${__dirname}/skin.mustache`).toString();
export const DEFAULT_SKIN_CSS = fs.readFileSync(`${__dirname}/skin.css`).toString();
