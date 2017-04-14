require('dotenv').config()

var fs = require('fs');
var Url = require('url');
var path = require('path');
var http = require('http');
var express = require('express');
var instagram = require('./social/instagram');
var renderPosts = require('./posts/render');
var renderSlider = require('./posts/slider');
var renderUser = require('./user/render');
var recentSelector = require('./posts/recent');
var cookieParser = require('cookie-parser');
var { sendHtml, sendJson, sendError } = require('./send');
var { main, terms, home, settings, slider } = require('./view/preload');

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
        instagram.user(token),
        instagram.recent(token)
    ])
    .then(([user, posts]) => ([
        `<div id="route-outlet">`,
        `<div class="outlet" name="settings">${renderUser(user)}</div>`,
        `<div class="outlet" name="home">${renderPosts([user, posts])}</div>`,
        `</div>`
    ]).join(''))
    .then(main)
    .then(htmlRes)
    .catch(sendError(res))
});

app.get('/terms', (req, res) => sendHtml(res)(terms));

app.get('/slider', (req, res) => {
    const followers = [1,2,3,4,5]
    const likes = [1,2,3,4,5,6,7,8,9];
    const percent = followers.length / likes.length;
    const sliderHtml = renderSlider([followers, likes.map(id => ({id}))])
    sendHtml(res)(sliderHtml.replace('{{_POST_}}', '%' + (percent * 100).toFixed(0)));
});

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
    const token = req.cookies.token || url.query.token;

    if (!token) return sendHtml(res)(home);

    Promise.all([
        instagram.user(token),
        instagram.recent(token).then(posts => posts[0] || {})
    ])
    .then(recentSelector)
    .then(sendJson(res))
    .catch(sendError(res))
});

app.get('/media/:id', (req, res) => {
    const mapIds = fs => fs.map(f => f.id);
    const url = Url.parse(req.url, true);
    const token = req.cookies.token || url.query.token;
    const mediaId = req.params.id;

    if (!token) return sendHtml(res)(home);
    if (!mediaId) return sendError(res)({ message: 'No Media Id Supplied' });

    const mediaHtml = Promise.all([
        instagram.user(token),
        instagram.media(token, mediaId).then(post => [post])
    ]).then(renderPosts);
    
    const sliderHtml = Promise.all([
        instagram.followedBy(token).then(mapIds),
        instagram.likes(token, mediaId)
    ]).then(renderSlider);

    Promise.all([mediaHtml, sliderHtml])
    .then(([postHtml, sliderHtml]) => sliderHtml.replace('{{_POST_}}', postHtml))
    .then(sendHtml(res))
    .catch(sendError(res));
})

http.createServer(app).listen(port, () => {
  console.log("Listening on port " + port);
});