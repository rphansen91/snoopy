const { pluck } = require('rp-utils');
const moment = require('moment');

const formatTime = (time) => moment(time * 1000).startOf('minute').fromNow();
const plucker = (path, defaultValue) => data => pluck(data, path) || defaultValue;

// FOR POST DATA
const mediaId = plucker('id', '');
const clickUrl = plucker('link', '');
const image = plucker('images.thumbnail.url', '');
const caption = plucker('caption.text', '');
const likes = plucker('likes.count', 0);
const comments = plucker('comments.count', 0);
const username = plucker('user.full_name', '');
const createdAt = (post) => formatTime(pluck(post, 'created_time'));

// FOR USER DATA
const followedBy = (user) => pluck(user, 'counts.followed_by') || 0;
const follows = (user) => pluck(user, 'counts.follows') || 0;

module.exports = {
    mediaId,
    image,
    caption,
    likes,
    comments,
    follows,
    followedBy,
    username,
    createdAt,
    clickUrl
}