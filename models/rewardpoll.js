var mongoose = require('mongoose');

exports.ChoiceSchema = new mongoose.Schema({ 
	text: {type: 'String', require: true},
	votes: Number,
	totalVotes: Number
});