var { slider } = require('../view/preload');

module.exports = ([followerIds, likes]) => {
    const count = likes.filter(f => followerIds.includes(f.id)).length;
    return slider(count / likes.length)
    .replace('{{_DESC_}}', `<p style="text-align: center">Your followers account for <em>${count}</em> out of the <em>${likes.length}</em> likes</p>`)
}