const recentSelector = require('./recent');

const plural = text => count => text + (count == 1 ? '' : 's');
const pluralLikes = plural('like');
const pluralComments = plural('comment');
const pluralFollows = plural('follower');
const rand = max => Math.floor(Math.random() * max);
const rand10000 = () => rand(10000);

const HTML = `
<script>
    history.pushState(null, "", location.href.split("?")[0]);
</script>
`

module.exports = ([user, posts]) => {
    return HTML.concat((posts || [])
    .map(post => recentSelector([user, post]))
    .map(post => `
    <a class="post" href="/media/${post.mediaId}">
        <img src="${post.image}" />
        <div class="info">
            <div class="counts">
                <div><b>${post.likes}</b> ${pluralLikes(post.likes)}</div>
                <div><b>${post.comments}</b> ${pluralComments(post.comments)}</div>
                <!--<div><b>${post.followedBy}</b> ${pluralFollows(post.followedBy)}</div>-->
            </div>
            <p class="time">${post.createdAt}</p>
        </div>
    </a>`)
    .join(''))
}