function isLiked(target) {
    fetch(`/post/liked/${target}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação');
            }
            return response.json(); 
        })
        .then(data => {
            if(data.isLiked){
                document.getElementById(`button_${target}`).innerHTML = `Descurtir <i class="fa fa-heart" aria-hidden="true"></i>`;
            }else{
                document.getElementById(`button_${target}`).innerHTML = `Curtir <i class="fa fa-heart-o" aria-hidden="true"></i>`;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function likeAction(event){
    let button = event.target;
    let id = button.id;
    id = id.replace('button_', '');

    console.log(`/like/${id}`)

    fetch(`/like/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na solicitação');
        }
        return response.json(); 
    })
    .then(data => {
        if(data.likeStatus){
            let curtidas = parseInt(document.getElementById(`count_${id}`).innerText.replace(' curtidas', ''));
            document.getElementById(`count_${id}`).innerHTML = `<strong>${curtidas+1}</strong> curtidas`;
            document.getElementById(`button_${id}`).innerHTML = `Descurtir <i class="fa fa-heart" aria-hidden="true"></i>`;
        }else{
            let curtidas = parseInt(document.getElementById(`count_${id}`).innerText.replace(' curtidas', ''));
            document.getElementById(`count_${id}`).innerHTML = `<strong>${curtidas-1}</strong> curtidas`;
            document.getElementById(`button_${id}`).innerHTML = `Curtir <i class="fa fa-heart-o" aria-hidden="true"></i>`;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function postInfo(id){
    fetch(`/post/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação');
            }
            return response.json(); 
        })
        .then(data => {
            const userInfo = document.getElementById('users-list');
            userInfo.innerHTML = '';

            data.likes.forEach(like => {
                const info = document.createElement('div');
                info.className = 'user';
                info.onclick = () => {
                    window.location.href = `/perfil/${like.user.username}`;
                }
                info.innerHTML = `
                    <img src="${like.user.picture}">
                    <div class="user-text">
                        <p><strong>${like.user.username}</strong></p>
                        <p>${like.user.name}</p>
                    </div>
                `;
                userInfo.appendChild(info);
            })
            
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}