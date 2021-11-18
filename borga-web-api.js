'use strict'
const express = require('express');
const error = require('./borga-errors')

const openApiUi = require('swagger-ui-express');
const openApiSpec = require('./docs/borga-spec.json');

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
		top : getTopNGames,
		id : getGameById,
		name : getGamesByName
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
	 * Responds with game object or throws exception if game with [id] does not exist
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
	 * Responds  with top n popular games list or throws unknown exceptions
	 */
	async function getTopNGames(n, req, res) {
		try {	
			let popularGamesList = await services.getPopularGamesList(n)
			res.json(popularGamesList)
		} catch (err) {
			handleError(err, req, res)
		}
	}

	/**
	 * Get Games List by Name
	 * @param {name} name 
	 * @param {req} request object 
	 * @param {res} response object
	 * Responds with a list of all the games found by searching external Games API for [name]
	 */
	async function getGamesByName(name, req, res) {
		try {
			let searchList = await services.getGamesListByName(name)
			res.json({ searchList })
		} catch (err) {
			handleError(err, req, res)
		}
	}

	/* GROUPS RELATED FUNCTIONS */

	async function handleCreateGroup(req, res) {
		try {
			let newGroupName = req.body.name
			let newGroupDescription = req.body.description
			if ((newGroupName == undefined) && (newGroupDescription == undefined)) throw error.WEB_API_INVALID_GROUP_DETAILS
			let groupID = await services.createGroup(newGroupName, newGroupDescription)
			// Add [groupID] to user.groups array ->[[groupdID,groupName],[]]
			res.json({
				id : groupID
			})
		} catch (err) {
			handleError(err, req, res)
		}
	}

	async function handleDeleteGroup(req, res) {
		try {
			let id = req.params.id
			if (!id) throw error.WEB_API_INSUFICIENT_GROUP_INFORMATION
			if (!(await services.getGroup(id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
			let deleteStatus = await services.deleteGroup(id)
			if (deleteStatus) res.sendStatus(200)
		} catch (err) {
			handleError(err, req, res)
		}
	}

	async function handleEditGroup(req, res) {
		try {
			let id = req.body.id 
			if (!(await services.getGroup(id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
			let newName = req.body.name
			let newDescription = req.body.description
			if (!id) throw error.WEB_API_INVALID_GROUP_DETAILS
			if (!newName && !newDescription) throw error.WEB_API_INVALID_GROUP_DETAILS
			if (newName) await services.changeGroupName(id, newName)
			if (newDescription) await services.changeGroupDescription(id, newDescription)
			res.json( { id : await services.getGroup(id) } )
		} catch (err) {
			handleError(err, req, res)
		} 
	}

	async function handleGetGroupDetail(req, res){

		try{
			let id = req.param.id 
			if (!(await services.getGroup(id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST 
			res.json(await services.getGroupDetail(id))  

		}
		catch(err){
			console.log(err)
			handleError(err,req,res)
		}


	}

	async function handleGetGroups(req, res) {
		try {
			let groups = await services.getGroups()
			res.json({ groups })
		} catch (err) {
			handleError(err, req, res)
		}
	} 

	async function handleCreateUser(req, res) {
		try {	
			let newUserName = req.body.username
			if (!newUserName) throw error.WEB_API_INVALID_USER_NAME
			let newUserID = await services.createUser(newUserName)
			// Later return the UUID token here so that user can store it in local storage
			res.json({ newUserID })
		} catch (err) {
			handleError(err, req, res)
		}
	}

	// Serve the API documents
	router.use('/docs', openApiUi.serve);
	router.get('/docs', openApiUi.setup(openApiSpec));


	// PATHS HANDLING \\
	// Resource: /games
	router.get('/games/search', handleGamesQueries);

	// Resource: /groups
	router.get('/groups', handleGetGroups)
	// router.get('/groups/:id', handleGetGroup)
	router.post('/groups/', handleCreateGroup)
	router.delete('/groups/:id', handleDeleteGroup)
	router.put('/groups/', handleEditGroup)

	// Resource: '/groups/games'
	// router.post('/groups/games', handleAddGroupGame)
	// router.delete('/groups/games/:game_id', handleGetGroupGame)

	// Resource: /users
	router.post('/users/', handleCreateUser)

	return router;
};