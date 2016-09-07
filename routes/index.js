var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db;

db = mongoose.connect('localhost:27017/poll');

var choiceSchema = require('../models/rewardpoll.js').ChoiceSchema;
var Choices = db.model('choices', choiceSchema);


router.get('/', function(req, res, next) {
	res.render("index");
})

router.get('/get-poll', function(req, res, next) {
	Choices.find()
		.then(function(doc) {
			res.render('index', {choices: doc});
		})
})

router.post('/set-new-choice', function(req, res, next) {
	var item = {
		text: req.body.choice,
		votes: 0,
		totalVotes: 0
	}

	var choice = new Choices(item);
	choice.save();
	res.redirect('/#rewards');
})

router.post('/vote', function(req, res, next) {
	var theText = req.body.text;
	var vote = req.body.vote
	var total = 0;
	Choices.findOne({text: theText}, function(err, choices) {
		if(err){
			console.log('Error when looking up choice')
		}
		if(vote == 'on'){
			choices.votes += 1;
			total = choices.totalVotes + 1;
		}
		Choices.update({},{ $set: {totalVotes: total}}, {multi: true}).exec();
		choices.save(function (err) {
        	if(err) {
           		console.log('Error when saving the vote');
        	}
    	});
	});
	res.redirect('/#rewards');
})

router.post('/delet-choice', function(req, res, next) {
	var id = req.body.id;
	Choices.findByIdAndRemove(id).exec();
	res.redirect('/#rewards');
})

module.exports = router;


