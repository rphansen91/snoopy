const fs = require('fs');
const path = require('path');

const HANDLEBARS = '{{_CONTENT_}}';
const place = root => html => content => html.replace(root, content);
const placeContent = place(HANDLEBARS);
const pipe = (...fns) => arg => fns.reduce((v, fn) => fn(v), arg);
const loadFile = pathname => fs.readFileSync(pathname, 'utf-8');
const filePath = type => name => path.resolve(__dirname, name + '.' + type);
const htmlPath = filePath('html');
const loadHtmlFile = pipe(htmlPath, loadFile);
const mainHtmlFile = loadHtmlFile('main');
const wrapHtml = placeContent(mainHtmlFile);
const loadMainHtmlFile = pipe(loadHtmlFile, wrapHtml);
const homeHtml = loadMainHtmlFile('home');
const termsHtml = loadMainHtmlFile('terms');

module.exports = {
    main: wrapHtml,
    home: homeHtml,
    terms: termsHtml,
}