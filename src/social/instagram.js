const FormData = require('form-data');
const fetch = require('node-fetch');

const fetchData = url => fetch(url).then(res => res.json()).then(res => res.data);
const fetchLog = url => fetch(url).then(res => res.json()).then(res => {console.log(res); return res.data});
const authenticatedUrl = endpoint => token => `${process.env.INSTAGRAM_API}${endpoint}?access_token=${token}`
const authorizationUrl = () => `${process.env.INSTAGRAM_API}/oauth/authorize/?client_id=${process.env.INSTAGRAM_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT}&response_type=code&scope=${process.env.INSTAGRAM_SCOPE}`;
const tokenUrl = (code) => `${process.env.INSTAGRAM_API}/oauth/access_token`;
const tagsUrl = (token, tag) => authenticatedUrl(`/v1/tags/${tag}/media/recent`)(token);
const likes = (token, mediaId) => authenticatedUrl(`/v1/media/${mediaId}/likes`)(token);
const media = (token, mediaId) => authenticatedUrl(`/v1/media/${mediaId}`)(token);
const recentUrl = authenticatedUrl('/v1/users/self/media/recent');
const users = authenticatedUrl('/v1/users/self');
const followedBy = authenticatedUrl('/v1/users/self/followed-by');

const tokenData = (code) => {
    var form = new FormData();
    form.append('client_id', process.env.INSTAGRAM_ID);
    form.append('client_secret', process.env.INSTAGRAM_SECRET);
    form.append('redirect_uri', process.env.INSTAGRAM_REDIRECT);
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    return form;
}

module.exports = {
    accessToken: (code) => fetch(tokenUrl(code), {
        method: 'POST',
        body: tokenData(code)
    }).then(res => res.json()),
    authorizationUrl: authorizationUrl,
    recent: (token) => fetchData(recentUrl(token)),
    tags: (token, tag) => fetchData(tagsUrl(token, tag)),
    user: (token) => fetchData(users(token)),
    followedBy: (token) => fetchData(followedBy(token)),
    likes: (token, mediaId) => fetchData(likes(token, mediaId)),
    media: (token, mediaId) => fetchData(media(token, mediaId))
}