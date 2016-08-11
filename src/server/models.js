var uuid = require('uuid');

var User = function(params) {
	this.name = params.name || 'anony';
	this.status = params.status || 0;
}

var Room = function(params) {
	this.roomSize = params.size || 2;
	this.id = params.id || uuid.v4();
	this.users = [];
	this.capacity = params.capacity || 2;
}

Room.prototype = {
	acceptPlayer: function(user) {
		if (this.users.length >= this.capacity) {
			return;
		} else {
			if (user instanceof User)
				this.users.push(user);
			else
				throw new Error('Room.acceptPlayer: Param must be a valid User Object');
		}
	},
	currentSize: function() {
		return this.users.length;
	}
}

exports.initRoom = function(params) {
	return new Room(params);
}
exports.User = User;
exports.Room = Room;