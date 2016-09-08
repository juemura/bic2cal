var mongoose = require('mongoose');

exports.AdminSchema = new mongoose.Schema({ 
	username: String,
	password: String
}, { collection: 'admin'});