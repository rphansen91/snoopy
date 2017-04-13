module.exports = user => `
    <div class="post user">
        <img src="${user.profile_picture}" />
        <div class="info">
            <h4>${user.full_name}</h4>
            <p>${user.bio}</p>
        </div>
        <div class="action">
            <a class="route" href="/terms">Terms</a>
            <a class="route" href="/logout">Logout</a>
        </div>
    </div>
`