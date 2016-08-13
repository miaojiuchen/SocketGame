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
var Player = models.Player;
var initRoom = models.initRoom;

// app settings
require('./appsettings.js')(app);
var _port = app.get('port');
var _host = app.get('host');

app.get('/', function (req, res) {
    var roomId = uuid.v4();
    qrcode.toDataURL('http://' + _host + ':' + _port + '/player?roomId=' + roomId, function (err, src) {
        res.render('room', { title: 'Socket Game', roomId: roomId, imgSrc: src, message: 'index from server', host: _host, port: _port });
    });
});

app.get('/player', function (req, res) {
    res.render('player', { title: 'Socket Game', host: _host, port: _port });
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
        // 1、房间关闭
        var roomId = getRoomBySocket(socketId);
        if (roomId) {
            var pair = rooms[roomId];
            var players = pair.room.players;
            // 向房间中的玩家发送roomDisconnect事件
            players.forEach(function (p, i) {
                sockets[p.socketId].emit('roomDisconnect', {});
            });
            delete pair;
            _.print('Room', roomId, 'Disconnected and unregistered');
        }
        //2、玩家离开房间
    });
    socket.on('register', function (data) {
        var roomId = data.roomId;
        rooms[roomId] = { room: initRoom({ roomId: roomId }), socketId: this.id };
        _.print('Room', roomId, 'Connected and registered');
    });
    socket.on('playerEnter', function (data) {
        var playerName = data.playerName, roomId = data.roomId;
        var pair = rooms[roomId];

        // 为当前房间增加玩家
        if (pair.room.acceptPlayer(new Player({ name: playerName, socketId: this.id }))) {
            // 通知当前房间渲染新玩家资料
            sockets[pair.socketId].emit('playerEnter', { playName: playerName });
            _.print('Player ', playerName, 'Enter room', roomId);
        } else {
            return;
        }
    });
});

server.listen(_port);
console.log('Server running at port', _port);
