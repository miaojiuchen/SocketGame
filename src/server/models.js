var uuid = require('uuid');

var Player = function (params) {
	this.name = params.name || 'anony';
	this.socketId = params.socketId;
}

var Room = function (params) {
	this.capacity = params.capacity || 2;
	this.roomId = params.roomId || uuid.v4();
	this.players = [];
}

Room.prototype = {
	acceptPlayer: function (player) {
		if (this.players.length >= this.capacity) {
			return false;
		} else {
			if (player instanceof Player) {
				this.players.push(player);
				return true;
			}
			else
				throw new Error('Room.acceptPlayer: Param must be a valid Player Object');
		}
	},
	currentSize: function () {
		return this.players.length;
	}
}

exports.initRoom = function (params) {
	return new Room(params);
}
exports.Player = Player;
exports.Room = Room;