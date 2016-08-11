; (function () {
	
	var port = '8001';
	var host = 'localhost';
	var roomId = $('room_id').value;
	var socket = io(host + ':' + port);

	socket.on('pingFromServer', function (data) {
		console.log(data);
		setTimeout(function () {
			ping();
		}, 500);
	});
	socket.emit('register', { roomId: roomId });

	socket.on('playerEnter', function(data){
		
	});
})();
