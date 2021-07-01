require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cocors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const rateLimit = require('./middlewares/ratelimiter');
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

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
	centralErrors(err, req, res);
});
app.listen(PORT);
