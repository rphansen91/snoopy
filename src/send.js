var { pluck } = require('rp-utils');
var { error } = require('./view/preload');

var parseErr = err => err && err.message ? err.message : err;
var sendContent = type => res => content => {
    res.setHeader('Content-Type', type);
    res.send(content);
}
var sendError = res => err => {
    const message = `<h1>Error:</h1><p>${parseErr(err)}</p>`
    const errorHtml = error(message);
    sendHtml(res)(errorHtml);
}

var sendHtml = sendContent('text/html');
var sendJson = sendContent('application/json');

module.exports = {
    sendError,
    sendHtml,
    sendJson
}