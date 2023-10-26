fetch('/post/news', {
    method: 'GET', // Este é o método padrão, então você pode omiti-lo
    headers: {
      'Content-Type': 'application/json', // Se necessário, ajuste os cabeçalhos
      // Adicione quaisquer outros cabeçalhos necessários aqui
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na solicitação');
      }
      return response.json();
    })
    .then(data => {
        if(data.length > 0 && data.length < 10){
            document.getElementById('in-num').style.display = 'flex';
            document.getElementById('inbox-number').innerHTML = data.length;
        }
        else if(data.length > 10){
            document.getElementById('in-num').style.display = 'flex';
            document.getElementById('inbox-number').innerHTML = '9+';
        }
    })
    .catch(error => {
      console.log(error);
    });
  