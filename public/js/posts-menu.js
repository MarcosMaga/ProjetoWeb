let notificationsNumber = 0;
let first = true;

function getNewsPosts() {
  fetch('/news/post', {
    method: 'GET', // Este é o método padrão, então você pode omiti-lo
    headers: {
      'Content-Type': 'application/json', // Se necessário, ajuste os cabeçalhos
      // Adicione quaisquer outros cabeçalhos necessários aqui
    },
  })
    .then(response => {
      if (!response.ok) {
        window.location.reload();
        throw new Error('Erro na solicitação');
      }
      return response.json();
    })
    .then(data => {
      if(data.length > notificationsNumber && !first){
        var audio = new Audio('/audio/notification.mp3');
        audio.play();
      }

      notificationsNumber = data.length;
      first = false;

      if (data.length > 0 && data.length < 10) {
        document.getElementById('in-num').style.display = 'flex';
        document.getElementById('inbox-number').innerHTML = data.length;
      }
      else if (data.length >= 10) {
        document.getElementById('in-num').style.display = 'flex';
        document.getElementById('inbox-number').innerHTML = '9+';
      }
    })
    .catch(error => {
      console.log(error);
    });
    setTimeout(getNewsPosts, 10000);
}

getNewsPosts();