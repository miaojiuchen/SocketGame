var qrcode = require('qrcode');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var models = require('./models.js');
var Room = models.Room;
var User = models.User;
var initRoom = models.initRoom;

// app settings
require('./appsettings.js')(app);

app.get('/', function (req, res) {
    qrcode.toDataURL('http://10.101.120.56:8001/room?rooId=2e56c', function (err, src) {
        res.render('index', { title: 'Socket Game', roomId: '2e56c', imgSrc: src, message: 'index from server' });
    });
});

app.get('/room', function (req, res) {
    res.render('room', { title: 'Socket Game', message: 'room from server' });
});

app.use(express.static(path.resolve(__dirname, '..') + '/client'));

var rooms = {};
io.on('connection', function (socket) {
    // 创建房间
    socket.on('register', function (data) {
        rooms[roomId] = initRoom({ roomId: data.roomId });
    });

    socket.on('eventFromClient', function (data) {
        console.log(data);
        setTimeout(function () {
            socket.emit('pingFromServer', { timestamp: new Date().getTime(), from: 'server' });
        }, 500);
    });
});

server.listen(8001);
console.log('Server running at port 8001');


