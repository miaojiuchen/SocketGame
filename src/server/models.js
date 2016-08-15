var uuid = require('uuid');
var _ = require('underscore');

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
			return { isSuccess: false, message = '房间已满' };
		} else {
			if (player instanceof Player) {
				var found = _.find(this.players, function (p) { return p.playerName === player.name });
				if (found) {
					return { isSuccess: false, message: '当前房间已有玩家使用此昵称，请重试' };
				}
				this.players.push(player);
				return { isSuccess: true };
			}
			else
				throw new Error('Room.acceptPlayer: Param must be a valid Player Object');
		}
	},
}

exports.initRoom = function (params) {
	return new Room(params);
}
exports.Player = Player;
exports.Room = Room;