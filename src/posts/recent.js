const { image, likes, followedBy, createdAt, caption, comments, clickUrl, mediaId } = require('./selectors');

module.exports = ([user, recent]) => ({
    mediaId: mediaId(recent),
    image: image(recent),
    likes: likes(recent),
    caption: caption(recent),
    createdAt: createdAt(recent),
    comments: comments(recent),
    clickUrl: clickUrl(recent),
    followedBy: followedBy(user),
})