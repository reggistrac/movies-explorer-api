require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cocors = require('cors');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const rateLimit = require('./middlewares/ratelimiter');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralErrors } = require('./errors/errors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();


app.use(rateLimit);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

app.use(requestLogger);
app.use(cocors({
	origin: true,
	exposedHeaders: '*',
	credentials: true,
}));
app.use(cookieParser());

app.post('/signup', celebrate({	//	Регистрация.
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	}).unknown(true),
}), createUser);
app.post('/signin', celebrate({	//	Логин.
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}).unknown(true),
}), login);
app.use('/tech', require('./routes/tech'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('/', (req, res, next) => {
	next({ statusCode: 404 });
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
	centralErrors(err, req, res);
/*	const errorss = {
		400: 'Некорректный запрос',
		401: 'Необходима авторизация',
		403: 'Чужое',
		404: 'Такого не существует',
		409: 'Такой пользователь уже есть',
	};
	let message;
	if (err.errMess) { message = err.errMess; } else { message = errorss[err.statusCode]; }
	if (err.statusCode) {
		res.status(err.statusCode).send({ message });
	} else { res.status(500).send({ message: err.message }); }*/
});
app.listen(PORT);
