const bt = document.getElementsByClassName('followButton')[0];

fetch(`/follow/${bt.id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na solicitação GET, Status: ' + response.status);
        }
        return response.json(); // Analisar a resposta como JSON, se aplicável
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
        method: 'POST', // Método HTTP POST
        headers: {
            'Content-Type': 'application/json', // Tipo de conteúdo (JSON no exemplo)
        },
        body: JSON.stringify(data), // Converter o objeto em JSON
    };

    // Faça a solicitação POST usando a API Fetch
    fetch('/follow', options)
        .then(response => {
            // Verifique o código de status da resposta
            if (!response.ok) {
                throw new Error('Erro na solicitação POST, Status: ' + response.status);
            }
            return response.json(); // Analisar a resposta como JSON, se aplicável
        })
        .then(data => {
            bt.innerHTML = data.msg;
        })
        .catch(error => {
            console.error('Erro:', error);
        });

}