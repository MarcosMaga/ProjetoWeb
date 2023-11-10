let target = 0;

function setTarget(value) {
    target = value;
}

const enviarBtn = document.getElementById('send-comment');

enviarBtn.addEventListener('click', () => {
    createComment();
});

function createComment() {
    let input = document.getElementById('textComment');

    if(input.value == ''){
        input.style.border = '1px solid red';
        return;
    }

    const url = '/comment';

    const dados = {
        textComment: input.value,
        postId: target
    };

    const opcoes = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    fetch(url, opcoes)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP! Código: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(dadosResposta => {
            console.log('Resposta:', dadosResposta);
            document.getElementById('textComment').value = '';
        })
        .catch(erro => {
            console.error('Erro durante a requisição:', erro);
        });

}