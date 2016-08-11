var qrcode = require('qrcode');
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var models = require('./models.js');
var Room = models.Room;
var User = models.User;
var initRoom = models.initRoom;

app.get('/', function (req, res) {
    fs.readFile(path.resolve(__dirname, '..') + '/client/index.html', function (err, data) {
        if (err) {
            throw new Error(err);
        }
        else {
            res.end(data);
        }
    });
});

app.get('room', function (req, res) {
    fs.readFile(path.resolve(___dirname, '..') + 'client/room.html', function (err, data) {
        if (err) {
            throw new Error(err);
        }
        else {
            res.end(data);
        }
    });
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

QRCode.toDataURL('i am a pony!',function(err,url){
    console.log(url);
});

server.listen(8001);
console.log('Server running at port 8001');


