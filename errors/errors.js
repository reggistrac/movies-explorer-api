module.exports.centralErrors = (err, req, res)=>{
	const errorss = {
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
	} else { res.status(500).send({ message: err.message }); }
}
