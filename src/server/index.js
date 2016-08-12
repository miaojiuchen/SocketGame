var qrcode = require('qrcode');
var uuid = require('uuid');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var _ = require('./utils.js');

var models = require('./models.js');
var Room = models.Room;
var User = models.User;
var initRoom = models.initRoom;

// app settings
require('./appsettings.js')(app);
var _port = app.get('port');
app.get('/', function (req, res) {
    var roomId = uuid.v4();
    qrcode.toDataURL('http://10.101.120.56:' + _port + '/player?roomId=' + roomId, function (err, src) {
        res.render('room', { title: 'Socket Game', roomId: roomId, imgSrc: src, message: 'index from server' });
    });
});

app.get('/player', function (req, res) {
    res.render('player', { title: 'Socket Game' });
});

app.use(express.static(path.resolve(__dirname, '..') + '/client/static'));

var rooms = {};

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        var id = this.id;
        _.print('Room', rooms[id].roomId,'Disconnected and unregistered');
        delete rooms[id];
    });
    socket.on('register', function (data) {
        var roomId = data.roomId;
        rooms[this.id] = initRoom({ roomId: roomId });
        _.print('Room', roomId, 'Connected and registered');
    });
    socket.on('playerEnter', function (data) {
        _.print('Player ', data.playerName, 'Enter room', data.roomId);
    });
});

server.listen(_port);
console.log('Server running at port', _port);


