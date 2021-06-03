const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
	nameRu: {
		type: String,
		required: true,
	},
	nameEn: {
		type: String,
		required: true,
	},
	director: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	duration:{
		type: Number,
		required: true,
	},
	description:{
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
		validate: {
			validator(v) {
				return validator.isURL(v);
			},
			message: 'Неправильная ссылка',
		},
	},
	trailer: {
		type: String,
		required: true,
		validate: {
			validator(v) {
				return validator.isURL(v);
			},
			message: 'Неправильная ссылка',
		},
	},
	thumbnail: {
		type: String,
		required: true,
		validate: {
			validator(v) {
				return validator.isURL(v);
			},
			message: 'Неправильная ссылка',
		},
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	movieId: {
		type: String,
		required: true,
	}
});

module.exports = mongoose.model('movie', movieSchema);
