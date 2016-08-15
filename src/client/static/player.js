/* 
    what we have? 
    roomId
    playerName
*/

; (function () {
    var playerName;
    $('enter').addEventListener('click', (function (e) {
        playerName = $('playerName').value;
        prepare();
    }));

    function prepare() {
        var server = $('server').value;
        var socket = io('ws://' + server);
        bindSocketEvents(socket);

        var roomId = extractRoomId('roomId');
        if (roomId !== '') {
            socket.emit('playerTryEnter', { roomId: roomId, playerName: playerName });
        } else {
            alert('error, missing \'roomId\' parameter');
        }
    }

    function extractRoomId(field) {
        var reg = field + '=([0-9\.]|[^&])*';
        var match = new RegExp(reg).exec(location.search);
        if (match) {
            return match[0].substr(field.length + 1);
        }
        return '';
    }

    function bindSocketEvents(socket) {
        // 房间意外关闭，清除所有监听
        socket.on('roomDisconnect', function (data) {
            $('mask2').style.display = 'block';
        });

        socket.on('playerTryEnterFail', function (data) {
            alert(data.message);
        });

        socket.on('playerTryEnterOk', function () {
            $('mask').style.display = 'none';
        });

        socket.on('gameStarts', function (data) {

        });

        socket.on('gameEnd', function (data) {

        });

        // 房间更新摇晃进度
        socket.on('update', function (data) {

        });
    }
})();