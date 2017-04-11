const FormData = require('form-data');
const fetch = require('node-fetch');

const authenticatedUrl = endpoint => token => `${process.env.INSTAGRAM_API}${endpoint}?access_token=${token}`
const authUrl = () => `${process.env.INSTAGRAM_API}/oauth/authorize/?client_id=${process.env.INSTAGRAM_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT}&response_type=code&scope=` + process.env.INSTAGRAM_SCOPE;
const tokenUrl = (code) => `${process.env.INSTAGRAM_API}/oauth/access_token`;
const tokenData = (code) => {
    var form = new FormData();
    form.append('client_id', process.env.INSTAGRAM_ID);
    form.append('client_secret', process.env.INSTAGRAM_SECRET);
    form.append('redirect_uri', process.env.INSTAGRAM_REDIRECT);
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    return form;
}
const tagsUrl = (token, tag) => authenticatedUrl(`/v1/tags/${tag}/media/recent/`)(token);
const recentUrl = authenticatedUrl('/v1/users/self/media/recent/');
const users = authenticatedUrl('/v1/users/self/');

module.exports = {
    authorizationUrl: authUrl,
    accessToken: (code) => fetch(tokenUrl(code), {
        method: 'POST',
        body: tokenData(code)
    }).then(res => res.json()),
    recent: (token) => fetch(recentUrl(token)).then(res => res.json()),
    tags: (token, tag) => fetch(tagsUrl(token, tag)).then(res => res.json()),
    user: (token) => fetch(users(token)).then(res => res.json())
}