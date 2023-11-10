let target = 0;
let block_c = false;
let loading_c = false;
let currentPage_c = 1;

function setTarget(value) {
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
            setTarget(target);
            loadMoreComments();
            document.getElementById('textComment').value = '';
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
                commentsContainer.innerHTML = '';

                data.comments.forEach(comment => {
                    commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <img src=${comment.commentator.picture}>
                        <div class='back'>
                            <p>${comment.textComment}</p>
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