const bt = document.getElementsByClassName('followButton')[0];

fetch(`/follow/${bt.id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na solicitação GET, Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        bt.innerHTML = data.msg;
    })
    .catch(error => {
        console.error('Erro:', error);
    });

function callFollow() {
    const [followerId, followingId] = bt.id.split('-').map(Number);
    const data = {followerId: followerId, followingId: followingId}

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
    };

    fetch('/follow', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação POST, Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            bt.innerHTML = data.msg;
            let followers = parseInt(document.getElementById('followers_count').innerText.replace(' seguidores', ''));

            if(data.msg == 'Seguir')
                document.getElementById('followers_count').innerHTML = `<strong>${followers - 1}</strong> seguidores`;
            else
                document.getElementById('followers_count').innerHTML = `<strong>${followers + 1}</strong> seguidores`;
        })
        .catch(error => {
            console.error('Erro:', error);
        });

}