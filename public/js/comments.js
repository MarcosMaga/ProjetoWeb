let target = 0;
let block_c = false;
let loading_c = false;
let currentPage_c = 1;

function setTarget(value) {
    document.getElementById('comments-list').innerHTML = '';
    target = value;
    block_c = false;
    currentPage_c = 0;
}

const btn = document.getElementById('send-comment');

btn.addEventListener('click', () => {
    createComment();
});

function createComment() {
    let input = document.getElementById('textComment');

    if(input.value == ''){
        input.style.border = '1px solid red';
        return;
    }

    const url = '/comment';

    const data = {
        textComment: input.value,
        postId: target
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! Código: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            input.style.border = 'none';
            let value = document.getElementById(`comments_${target}`).innerText;
            value = parseInt(value.replace(' comentários', ''));
            document.getElementById(`comments_${target}`).innerHTML = `<strong>${value+1}</strong> comentários`;
            document.getElementById('textComment').value = '';
            setTarget(target);
            loadMoreComments();
        })
        .catch(error => {
            console.error('Erro durante a requisição:', error);
        });
}

function loadMoreComments() {
    if (loading_c || block_c) 
        return;
    
    loading_c = true;
    const commentsContainer = document.getElementById('comments-list');

    const url = `/comment/${target}?page=${currentPage_c + 1}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data.comments.length);
            if(data.comments.length > 0){
                data.comments.forEach(comment => {
                    commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <img src=${comment.commentator.picture}>
                        <div class='back'>
                            <p><strong>${comment.commentator.name}</strong> • ${compareTime(comment.createdOn)}<br>${comment.textComment}</p>
                            ${data.user.id == comment.commentatorId || data.user.id == comment.post.receiverId ? `
                            <a style='margin-left: auto; margin-top: 5px; margin-right: 5px' href='/comment/delete/${comment.id}'><i class="fa fa-trash-o" aria-hidden="true"></i></a>` : ''}
                        </div>
                    `;
                    commentsContainer.appendChild(commentDiv);
                })
            }else{
                block_c = true;
            }
            loading_c = false;
        });
}

function actionMoreComments(){
    currentPage_c ++;
    loadMoreComments();
}