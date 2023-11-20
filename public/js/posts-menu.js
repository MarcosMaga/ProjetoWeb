let notificationsNumber = 0;
let first = true;

const socket = io();

socket.on('inbox', (message) => {
  console.log(message)
  if(message > notificationsNumber && !first){
    var audio = new Audio('/audio/notification.mp3');
    audio.play();
  }

  notificationsNumber = message;
  first = false;

  if (message > 0 && message < 10) {
    document.getElementById('in-num').style.display = 'flex';
    document.getElementById('inbox-number').innerHTML = message;
  }
  else if (message >= 10) {
    document.getElementById('in-num').style.display = 'flex';
    document.getElementById('inbox-number').innerHTML = '9+';
  }
})