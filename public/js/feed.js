window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMorePosts();
    }
});

let currentPage = 1;
let loading = false;
let block = false;

function loadMorePosts() {
    if (loading || block)
        return;

    loading = true;
    const postContainer = document.getElementById('post-data');

    const url = `/feed?page=${currentPage + 1}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.posts.length > 0) {
                currentPage++;
                data.posts.forEach(post => {
                    console.log(post);
                    const postDiv = document.createElement('div');
                    postDiv.className = "post-division";
                    let html = `
                        <p>De <a href="/perfil/${post.creator.username}">${post.creator.username}</a> para <a href="/perfil/${post.receiver.username}">${post.receiver.username}</a></p>
                        <div class="post-content">
                            <div class="post-content-receiver">
                                <img src=${post.receiver.picture}>
                                <a href="/perfil/${post.receiver.username}">${post.receiver.name}</a>
                                <div class="post-name">
                                    <p>@${post.receiver.username}</p>
                                    <p>•</p>
                                    <p>${compareTime(post.createdOn)}</p>
                                </div>
                                ${data.user && (data.user.id == post.creator.id || post.receiver.id) ? `<a class="delete-post" href="/post/delete/${post.id}"><i class="fa fa-trash-o" aria-hidden="true"></i></a>` : ''}
                            </div>
                            <p class="text-receiver">${post.textReceiver ? post.textReceiver : ''}</p>
                            <div class="post-creator">
                                <div class="post-creator-info">
                                    <img src="${post.creator.picture}">
                                    <p><a href="/perfil/${post.creator.username}">${post.creator.name}</a></p>    
                                    <p style="margin-left:5px; color:#1d1d1d;">@${post.creator.username}</p>
                                </div>
                                <p class="text-creator">${post.textCreator}</p>
                            </div>
                            <div class="info-post-data">
                                <p onclick="openLikes('${post.id}')" id="count_${post.id}" style="margin-left: 10px; cursor: pointer"><strong>0</strong> curtidas</p><p id="comments_${post.id}" style="margin-left: 10px; cursor: pointer;"><strong>${post.comments.length}</strong> comentários</p>
                            </div>`;

                    if (data.user) {
                        isLiked(post.id);
                        html += `<hr>
                                <div class="actions">
                                    <button id="button_${post.id}" onclick="likeAction(event)">Curtir <i class="fa fa-heart-o" aria-hidden="true"></i></button>
                                    <button onclick="openComments('${post.id}')">Comentar <i class="fa fa-comment-o" aria-hidden="true"></i></button>
                                </div>`
                    }

                    html += '</div></div>'
                    postDiv.innerHTML = html;
                    postContainer.appendChild(postDiv);
                })
            } else {
                block = true;
            }
            loading = false;
        });
}