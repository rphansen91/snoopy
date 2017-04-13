require('dotenv').config()

var { pluck } = require('rp-utils');
var fs = require('fs');
var Url = require('url');
var path = require('path');
var http = require('http');
var express = require('express');
var instagram = require('./social/instagram');
var renderPosts = require('./posts/render');
var renderUser = require('./user/render');
var recentSelector = require('./posts/recent');
var cookieParser = require('cookie-parser')
var { sendHtml, sendJson, sendError } = require('./send');
var { main, terms, home, settings } = require('./view/preload');

var app = express();
var port = process.env.PORT || 9000;

app.use(express.static('public'));

app.use(cookieParser());

app.get('/', (req, res) => {
    const url = Url.parse(req.url, true);
    const token = req.cookies.token || url.query.token;
    const htmlRes = sendHtml(res);

    if (!token) return htmlRes(home)
    
    return Promise.all([
        instagram.user(token)
        .then(user => user.data),
        instagram.recent(token)
        .then(posts => posts.data || [])
    ])
    .then(renderPosts)
    .then(main)
    .then(htmlRes)
    .catch(sendError(res))
});

app.get('/settings', (req, res) => {
    const url = Url.parse(req.url, true);
    const token = req.cookies.token || url.query.token;
    const htmlRes = sendHtml(res);

    if (!token) return htmlRes(home)

    instagram.user(token)
    .then(user => user.data)
    .then(renderUser)
    .then(settings)
    .then(htmlRes);
})

app.get('/terms', (req, res) => sendHtml(res)(terms));

app.get('/login', (req, res) => res.redirect(302, instagram.authorizationUrl()));

app.get('/instagram', (req, res) => {
    const url = Url.parse(req.url, true);
    const code = url.query.code;
    
    if (!code) return sendError(res)({ message: 'No Code' });
    
    instagram.accessToken(code)
    .then(body => {
        if (!body.access_token) return Promise.reject({ message: JSON.stringify(body) });
        res.cookie('token', body.access_token, { maxAge: 900000, httpOnly: true });
        res.redirect('/?token=' + body.access_token);
    })
    .catch(sendError(res))
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

app.get('/recent', (req, res) => {
    const url = Url.parse(req.url, true);
    const token = url.query.token;

    if (!token) return res.status(200).send({ err: 'Not Logged In' });

    Promise.all([
        instagram.user(token)
        .then(user => user.data),
        instagram.recent(token)
        .then(posts => posts.data[0] || {})
    ])
    .then(recentSelector)
    .then(sendJson(res))
    .catch(sendError(res))
})

http.createServer(app).listen(port, () => {
  console.log("Listening on port " + port);
});