; (function () {
    var playerName;
    function waitForName(callback) {
        $('enter').addEventListener('click', (function (e) {
            playerName = $('playerName').value;
            $('mask').style.display = 'none';
            if (callback && typeof callback === 'function') {
                callback();
            }
        }));
    }
    function prepare() {
        var server = $('server').value;
        var socket = io('ws://' + server);

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

    waitForName(prepare);
})();