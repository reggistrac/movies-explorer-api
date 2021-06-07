const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({	//	Регистрация.
	body: Joi.object().keys({
		name: Joi.string().required().min(1),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	}).unknown(true),
}), createUser);
router.post('/signin', celebrate({	//	Логин.
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}).unknown(true),
}), login);
router.use('/tech', require('./tech'));

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
router.use('/', (req, res, next) => {
	next({ statusCode: 404 });
});

module.exports = router;
