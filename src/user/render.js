module.exports = user => `
    <div class="post user">
        <img src="${user.profile_picture}" />
        <div class="info">
            <p><b>${user.full_name}</b></p>
            <p>${user.bio}</p>
        </div>
        <div class="action">
            <a class="route" href="/terms">Terms</a>
            <a class="route" href="/logout">Logout</a>
        </div>
    </div>
`