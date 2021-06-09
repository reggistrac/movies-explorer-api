const Movie = require('../models/movie');

module.exports.getSavedFilms = (req, res, next) => {
	Movie.find({})
	.populate('owner')
	.then((movie) => res.send({ data: movie }))
	.catch(next);
};
module.exports.addFilm = (req, res, next) => {
	const {
		nameRU, nameEN, director, country, year, duration,
		description, image, trailer, thumbnail, movieId
	} = req.body;
	Movie.create({
		nameRU, nameEN, director, country, year, duration,
		description, image, trailer, thumbnail, owner:req.id, movieId
	})
	.then((movie) => res.send({ data: movie }))
	.catch((err) => {
		if (err.name === 'ValidationError') { next({ statusCode: 400, errMess: "Ошибка валидации" }); }
		else { next(err); }
	});
};
module.exports.deleteFilm = (req, res, next)=>{
	Movie.findById(req.body.id)
	.then((movie) => {
		if(movie != null){
			if (movie.owner.toString() === req.id._id){
				movie.remove()
		//		Movie.findByIdAndRemove(req.body.id)
				.then(movie => res.send({ data: movie }))
				.catch((err) => {
					if (err.name === 'CastError') { next({ statusCode: 400 });}
					else { next(err); }
				});
			}
			else{next({ statusCode: 403 });}
		}
		else{next({ statusCode: 404 });}
	})
	.catch((err) => {
		if (err.name === 'CastError') { next({ statusCode: 400 }); }
		else { next(err); }
	});
}
