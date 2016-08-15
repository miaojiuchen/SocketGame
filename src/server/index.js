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
var players = {};
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
            // 向房间中的玩家发送roomDisconnect事件
            pair.room.players.forEach(function (p, i) {
                sockets[p.socketId].emit('roomDisconnect', {});
            });
            delete pair;
            _.print('Room', roomId, 'Disconnected');
        }
        //2、玩家离开房间
        else {
            // 根据socketId获取房间号和玩家名
            var obj = players[socketId];
            if (obj) {
                var roomPlayers = rooms[obj.roomId].room.players;
                roomPlayers.splice(_.findIndex(roomPlayers, function (p) { return p.playerName === obj.playerName }));
                _.print('Player', obj.playerName, 'leave room', obj.roomId);
            }
        }
    });

    // 在服务器端注册当前房间号
    socket.on('register', function (data) {
        var roomId = data.roomId;
        rooms[roomId] = { room: initRoom({ roomId: roomId }), socketId: this.id };
        _.print('Room', roomId, 'Connected');
    });

    socket.on('playerTryEnter', function (data) {
        var playerName = data.playerName, roomId = data.roomId;

        var pair = rooms[roomId];
        if (!pair) {
            message = '未找到房间';
        } else {
            // 为当前房间增加玩家
            if (pair.room.acceptPlayer(new Player({ name: playerName, socketId: this.id }))) {
                // 通知当前房间渲染新玩家资料
                sockets[pair.socketId].emit('playerEnter', { playerName: playerName });
                players[this.id] = { roomId: pair.room.roomId, playerName: playerName };
                this.emit('playerTryEnterOk');
                _.print('Player', playerName, 'enter room', roomId);
                return;
            } else {
                message = '房间已满';
            }
        }
        this.emit('playerTryEnterFail', { message: message });
    });
});

server.listen(_port);
console.log('Server running at port', _port);
