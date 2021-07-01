const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'very-secret-key' } = process.env;

module.exports.createUser = (req, res, next) => {
	const {
		name, email, password,
	} = req.body;

	bcrypt.hash(password, 10)
	.then((hash) => User.create({
		name, email, password: hash,
	}))
	.then((user) => res.send({
		data: {
			id: user._id, name: user.name, email: user.email,
		},
	}))
	.catch((err) => {
		if (err.name === 'ValidationError') { next({ statusCode: 400, errMess: "Ошибка валидации" }); }
		else if (err.name === 'MongoError' && err.code === 11000) { next({ statusCode: 409 }); }
		else { next(err); }
	});
};

module.exports.login = (req, res, next) => {
	const { email, password } = req.body;
	let userId;
	User.findOne({ email }).select('+password')
	.then((user) => {
		if (!user) {
			return Promise.reject(new Error('Неправильные почта или пароль'));
		}
		userId = user._id;
		return bcrypt.compare(password, user.password);
	})
	.then((matched) => {
		if (!matched) {
			return Promise.reject(new Error('Неправильные почта или пароль'));
		}
		const token = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '7d' });
		res.cookie('jwt', token, {
			maxAge: 3600000 * 24 * 30, httpOnly: true, secure: true, sameSite: 'none',
		}).status(200).send({ message: 'Ок' });
		return 'Ok';
	})

	.catch((err) => { next({ statusCode: 403, errMess: err.message }); });
};

module.exports.getUser = (req, res, next) => {
	const userId = req.id;
	User.findById(userId)
	.then((user) => {
		if (user != null) { res.send({ data: user }); }
		else { next({ statusCode: 404, errMess: "Нет таких" }); }
	})
	.catch((err) => {
		if (err.name === 'CastError') { next({ statusCode: 400, errMess: "Ошибка валидации" });}
		else { next(err); }
	});
};

module.exports.updateUser = (req, res, next) => {
	const { name, email } = req.body;

	User.findByIdAndUpdate(req.id, { name, email }, { new: true, runValidators: true })
	.then((user) => {
		if (user != null) { res.send({ data: user }); }
		else { next({ statusCode: 404, errMess: "Не найден в базе"}); }
	})
	.catch((err) => {
		if (err.name === 'ValidationError') { next({ statusCode: 400}); }
		else { next(err); }
	});
};

module.exports.logout = (req, res) => {
	res.clearCookie('jwt', { secure: true, sameSite: 'none' }).status(200).send({ message: 'Куки токен удалён' });
};

/*********************************************************************/
module.exports.getAllUsers = (req, res, next) => {
	User.find({})
	.then((users) => res.send({ data: users }))
	.catch(next);
};
module.exports.deleteUser = (req, res, next)=>{
	User.findByIdAndRemove(req.body.id)
	.then(user => res.send({ data: user }))
	.catch((err) => {
		if (err.name === 'CastError') { next({ statusCode: 400 });}
		else { next(err); }
	});
}
