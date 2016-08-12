var qrcode = require('qrcode');
var uuid = require('uuid');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var objectAssign = require('object-assign');
var _ = objectAssign({}, require('./utils.js'), require('underscore'));

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
var sockets = io.sockets.sockets;// 简单地使用 "/" namespace来管理sockets
function getRoomBySocket(socketId) {
    var found = _.find(
        _.pairs(rooms),
        function (kv) { return kv[1].socketId === socketId }
    );
    if (found) {
        return found[0];
    }
    return '';
};
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        var socketId = this.id;
        var roomId = getRoomBySocket(socketId);
        if (roomId) {
            _.print('Room', roomId, 'Disconnected and unregistered');
            delete rooms[roomId];
        }
    });
    socket.on('register', function (data) {
        var roomId = data.roomId;
        rooms[roomId] = { room: initRoom({ roomId: roomId }), socketId: this.id };
        _.print('Room', roomId, 'Connected and registered');
    });
    socket.on('playerEnter', function (data) {
        var playerName = data.playerName, roomId = data.roomId;
        _.print('Player ', playerName, 'Enter room', roomId);
        // rooms[this.id].acceptPlayer(new Player({ name: data.playName }));
        var room = rooms[roomId];
        sockets[room.socketId].emit('playerEnter', { playName: playerName });
    });
});

server.listen(_port);
console.log('Server running at port', _port);


