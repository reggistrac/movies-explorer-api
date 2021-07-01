const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator(v) {
				return validator.isEmail(v);
			},
			message: 'В поле email введён не e-mail',
		},
		unique: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
});

module.exports = mongoose.model('user', userSchema);
