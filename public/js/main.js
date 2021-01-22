const numberIpnut = document.getElementById('number'),
    textInput = document.getElementById('msg'),
    button = document.getElementById('button'),
    response = document.querySelector('.response');

button.addEventListener('click', send, false);
// because we brought in the script
const socket = io();
socket.on('smsStatus', function(data) { // catching on client side
    response.innerHTML = '<h5>Text message sent to ' + data.number + '</h5>';
})


function send() {
    const number = numberIpnut.value.replace(/\D/g, ''); // make sure there are no non-numeric characters
    const text = textInput.value;


    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({number: number, text: text})
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(err){
        console.log(err);
    });
}


// Client side JS