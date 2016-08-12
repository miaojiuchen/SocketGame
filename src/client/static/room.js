; (function () {
	var server = $('server').value;
	var socket = io('ws://' + server);

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
