'use strict'
const express = require('express');
const error = require('./borga-errors')

module.exports = function (services) {

	// Initialize express router
	const router = express.Router();
	// Add support for JSON inside express
	router.use(express.json());

	/**
	 * Handle Web Api Errors and pass them to client
	 * @param {err} error object thrown by other functions
	 * @param {req} request object 
	 * @param {res} response object
	 */
	function handleError(err, req, res) {
		// Research most important http codes and add them to borga-errors \\
		/*
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
		*/
		res.json({ cause: err });
	}
    
	/* GAMES RELATED FUNCTIONS */
	// Group of functions to handle queries related to games functionality
    const validGamesQueries = {
		top : getTopN,
		id : getGameById
	}

	/**
	 * Handle Games Queries (Ex: /games/search?id=yqR4PtpO8X)
	 * Based on the first query key execute the corresponding function
	 * and provide a response with JSON format
	 * @param {req} request object 
	 * @param {res} response object
	 */
	function handleGamesQueries(req, res) {
		try {
			// Extract first query key
			let firstQuery = Object.keys(req.query)[0]
			// If query is not recognized throw error
			if (!Object.keys(validGamesQueries).includes(firstQuery)) throw error.WEB_API_INVALID_QUERY
			// Call right function with parameter being req.query[top]
			validGamesQueries[firstQuery](req.query[firstQuery], req, res)
		} catch (err) {
			handleError(err, req, res)
		}
	}

	/**
	 * Get Game ID
	 * @param {id} Game ID 
	 * @param {req} request object 
	 * @param {res} response object
	 * @returns reponse with game object or throws exception if game with [id] does not exist
	 */
	async function getGameById(id, req, res) {
		try {
			let gameObject = await services.getGameById(id)
			res.json(gameObject)
		} catch (err) {
			handleError(err, req, res)
		}
	}

	/**
	 * Get Game ID
	 * @param {n} limit of elements to search for in the top of popularity
	 * @param {req} request object 
	 * @param {res} response object
	 * @returns reponse with top n popular games list or throws unknown exceptions
	 */
	async function getTopN(n, req, res) {
		try {	
			let gamesList = await services.getPopularGamesList(n)
			res.json(gamesList)
		} catch (err) {
			handleError(err, req, res)
		}
	}
	

	/* GROUPS RELATED FUNCTIONS */



	// PATHS HANDLING \\
	// Resource: /games
	router.get('/games/search', handleGamesQueries);

	return router;
};