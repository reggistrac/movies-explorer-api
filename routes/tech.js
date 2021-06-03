const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
	getAllUsers, deleteUser
} = require('../controllers/users');

router.get('/', getAllUsers);

router.delete('/', celebrate({
	body: Joi.object().keys({
		id: Joi.string(),
	}).unknown(true),
}), deleteUser);

module.exports = router;
