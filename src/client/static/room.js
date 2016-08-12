; (function () {
	var port = '8001';
	var host = 'ws://' + '10.101.120.56';
	var socket = io(host + ':' + port);
	console.log(socket);
	function init() {
		var roomId = $('roomId').value;
		socket.emit('register', { roomId: roomId });

		socket.on('playerEnter', function (data) {
			document.body.appendChild(
				document.createTextNode(JSON.stringify(data))
			);
		});
		socket.on('playerShake', function (data) {
			alert(data);
		});
	}
	init();
})();
