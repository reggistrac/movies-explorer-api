require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cocors = require('cors');
const cookieParser = require('cookie-parser');
//const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const rateLimit = require('./middlewares/ratelimiter');

//const { login, createUser } = require('./controllers/users');
//const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralErrors } = require('./errors/errors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(rateLimit);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;
mongoose.connect( DATABASE , {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

app.use(cocors({
	origin: true,
	exposedHeaders: '*',
	credentials: true,
}));
app.use(cookieParser());
app.use(require('./routes/routers'));
/*
app.post('/signup', celebrate({	//	Регистрация.
	body: Joi.object().keys({
		name: Joi.string().required().min(1),
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
*/
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
	centralErrors(err, req, res);
});
app.listen(PORT);
