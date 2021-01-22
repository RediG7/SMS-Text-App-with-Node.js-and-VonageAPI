require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('body-parser');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init VONAGE API(Nexmo)
const nexmo = new Nexmo({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
}, {
    debug: true
});

// Init app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile); // this way we can use our .html files for our views

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

// Catch form submit from client
app.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(req.body); // holds the form fields that are submitted
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        process.env.VONAGE_VIRTUAL_NUMBER, number, text, {
            type: 'unicode'
        },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                const {
                    messages
                } = responseData;
                const {
                    ['message-id']: id, ['to']: number, ['error-text']: error
                } = messages[0];
                console.dir(responseData);
                // Get data from response
                const data = {
                    id,
                    number,
                    error
                };


                // Emit to the client
                io.emit('smsStatus', data);
            }
        }
    );
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


// Connect to socket.io
const io = socketio(server);
io.on('connection', (scoket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})