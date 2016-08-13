/* 
    what we have? 
    roomId
    playerName
*/

; (function () {
    var playerName;
    function waitForName() {
        $('enter').addEventListener('click', (function (e) {
            playerName = $('playerName').value;
            $('mask').style.display = 'none';
            prepare();
        }));
    }
    function prepare() {
        var server = $('server').value;
        var socket = io('ws://' + server);
        // 房间意外关闭
        socket.on('roomDisconnect', function(data){
            alert('room closed');
            $('mask2').style.display = 'block';
        });
        function extractRoomId(field) {
            var reg = field + '=([0-9\.]|[^&])*';
            var match = new RegExp(reg).exec(location.search);
            if (match) {
                return match[0].substr(field.length + 1);
            }
            return '';
        }
        var roomId = extractRoomId('roomId');
        if (roomId !== '') {
            socket.emit('playerEnter', { roomId: roomId, playerName: playerName });
        } else {
            alert('error, missing \'roomId\' parameter');
        }
    }

    waitForName();
})();