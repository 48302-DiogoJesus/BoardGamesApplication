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

	// Resource: /global/books
	router.get('/global/books', searchGlobalBooks);

	// Resource: /my/books
	router.get('/my/books', getMyBooks);
	router.post('/my/books', addMyBookById);

	// Resource: /my/books/<bookId>
	router.get('/my/books/:bookId', getMyBookById);
	router.delete('/my/books/:bookId', deleteMyBookById);

	return router;
};