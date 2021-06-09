const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
	getSavedFilms, addFilm, deleteFilm,
} = require('../controllers/movies');

router.get('/', getSavedFilms);

router.post('/', celebrate({
	body: Joi.object().keys({
		nameRU: Joi.string().required(),
		nameEN: Joi.string().required(),
		director: Joi.string().required(),
		country: Joi.string().required(),
		year: Joi.string().required(),
		duration: Joi.number().required(),
		description: Joi.string().required(),
		image: Joi.string().required().custom((value, helpers) => {
			if (validator.isURL(value, { require_protocol: true })) { return value; }
			return helpers.message('Невалидная ссылка');
		}),
		trailer: Joi.string().required().custom((value, helpers) => {
			if (validator.isURL(value, { require_protocol: true })) { return value; }
			return helpers.message('Невалидная ссылка');
		}),
		thumbnail: Joi.string().required().custom((value, helpers) => {
			if (validator.isURL(value, { require_protocol: true })) { return value; }
			return helpers.message('Невалидная ссылка');
		}),
		movieId: Joi.string().required(),
	}).unknown(true),
}), addFilm);

router.delete('/', celebrate({
	body: Joi.object().keys({
		id: Joi.string(),
	}).unknown(true),
}), deleteFilm);

module.exports = router;
