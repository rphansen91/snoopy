const { image, likes, followedBy, createdAt, caption, comments, clickUrl } = require('./selectors');

module.exports = ([user, recent]) => ({
    image: image(recent),
    likes: likes(recent),
    caption: caption(recent),
    createdAt: createdAt(recent),
    comments: comments(recent),
    clickUrl: clickUrl(recent),
    followedBy: followedBy(user)
})