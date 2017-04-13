const fs = require('fs');
const path = require('path');
const pipe = require('../utility/pipe');

const HANDLEBARS = '{{_CONTENT_}}';

const loadFile = pathname => fs.readFileSync(pathname, 'utf-8');
const filePath = type => name => path.resolve(__dirname, name + '.' + type);
const place = root => html => content => html.replace(root, content);
const placeContent = place(HANDLEBARS);

const htmlPath = filePath('html');
const loadHtmlFile = pipe(htmlPath, loadFile);
const mainHtmlFile = loadHtmlFile('main');
const wrapHtml = placeContent(mainHtmlFile);
const loadMainHtmlFile = pipe(loadHtmlFile, wrapHtml);
const homeHtml = loadMainHtmlFile('home');
const termsHtml = loadMainHtmlFile('terms');
const loadContentFile = pipe(loadMainHtmlFile, placeContent);
const settingsHtml = loadContentFile('settings');

module.exports = {
    main: wrapHtml,
    home: homeHtml,
    terms: termsHtml,
    settings: settingsHtml
}