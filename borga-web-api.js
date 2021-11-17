'use strict'
const express = require('express');
const error = require('./borga-errors')

module.exports = function (services) {

	function onError(req, res, err) {
		switch (err.name) {
			case 'NOT_FOUND': 
				res.status(404);
				break;
			case 'EXT_SVC_FAIL':
				res.status(502);
				break;
			default:
				res.status(500);				
		}
		res.json({ cause: err });
	}
    
    const router = express.Router();

	router.use(express.json());

	function handleGamesQueries(req) {
		switch(req.query) {

		}
	}

	async function getTopN(req, res) {
		res.json(await services.getPopularGamesList(req.query.top))
	}
	
	// Resource: /global/books
	router.get('/games/?top=56&abc=asdh', getTopN);


	/*
	// Resource: /my/books
	router.get('/my/books', getMyBooks);
	router.post('/my/books', addMyBookById);

	// Resource: /my/books/<bookId>
	router.get('/my/books/:bookId', getMyBookById);
	router.delete('/my/books/:bookId', deleteMyBookById);
	*/

	return router;
};