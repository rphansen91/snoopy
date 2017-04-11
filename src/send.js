var { pluck } = require('rp-utils');

var parseErr = err => err && err.message ? err.message : err;
var sendContent = type => res => content => {
    res.setHeader('Content-Type', type);
    res.send(content);
}
var sendError = res => err => res.send({ err: parseErr(err) });
var sendHtml = sendContent('text/html');
var sendJson = sendContent('application/json');

module.exports = {
    sendError,
    sendHtml,
    sendJson
}