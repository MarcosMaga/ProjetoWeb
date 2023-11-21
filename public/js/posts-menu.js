let notificationsNumber = 0;
let notificationsNumber2 = 0;
let first = true;
let first2 = true;

const socket = io();

socket.on('inbox', (message) => {
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

socket.on('notification', (message) => {
  if(message > notificationsNumber2 && !first2){
    var audio = new Audio('/audio/notification2.mp3');
    audio.play();
  }

  notificationsNumber2 = message;
  first2 = false;

  if (message > 0 && message < 10) {
    document.getElementById('nt-num').style.display = 'flex';
    document.getElementById('nt-number').innerHTML = message;
  }
  else if (message >= 10) {
    document.getElementById('nt-num').style.display = 'flex';
    document.getElementById('nt-number').innerHTML = '9+';
  }
})