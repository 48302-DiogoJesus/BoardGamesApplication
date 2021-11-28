'use strict'
const express = require('express');
const error = require('./borga-errors')

const YAML = require('yamljs')
const openApi = require('swagger-ui-express');
const openApiSpec = YAML.load('./docs/borga-spec.yaml');

module.exports = function (services, queue) {
	// Initialize express router
	const router = express.Router();
	// Add support for JSON inside express
	router.use(express.json());

	/**
	 * Get the user access token from request
	 * @param {req} Request object
	 * @returns the token extracted from the request headers
	 */
	function getBearerToken(req) {
		const auth = req.header('Authorization');
		if (auth) {
			const authData = auth.trim();
			if (authData.substr(0,6).toLowerCase() === 'bearer') {
				return authData.replace(/^bearer\s+/i, '');
			}
		}
		return null;
	}

	/**
	 * Handle Web Api Errors and pass them to client
	 * @param {err} error object thrown by other functions
	 * @param {req} request object 
	 * @param {res} response object
	 */
	function handleError(err, req, res) {
		res.status(err.http_code).json({ cause: err });
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
	async function handleGamesQueries(req, res) {
		try {
			// Extract first query key
			let firstQuery = Object.keys(req.query)[0]
			// If query is not recognized throw error
			if (!Object.keys(validGamesQueries).includes(firstQuery)) throw error.WEB_API_INVALID_QUERY
			// Since this function calls the Exteral API it makes sense to queue here
			await queue.wait()
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
			res.status(200).json(gameObject)
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
			res.status(200).json(popularGamesList)
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
			res.status(200).json({ searchList })
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
			res.status(201).json({
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
			if (deleteStatus) res.sendStatus(204)
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
			res.status(204).json( { id : await services.getGroup(id) } )
		} catch (err) {
			handleError(err, req, res)
		} 
	}

	async function handleGetGroupById(req, res){
		try{
			let id = req.params.id 
			if (!(await services.getGroup(id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST 
			res.status(200).json(await services.getGroupDetails(id))
		}
		catch(err){
			handleError(err,req,res)
		}
	}

	async function handleGetGroups(req, res) {
		try {
			let groups = await services.getGroups()
			res.status(200).json({ groups })
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
			res.status(201).status().json({ newUserID })
		} catch (err) {
			handleError(err, req, res)
		}
	} 

	async function handleAddGameToGroup(req,res){
		try{
			let new_game_id = req.query.game_id  
			
			let group_ID = req.params.id
			
			let updatedGroup = await services.addGameToGroupByID(group_ID, new_game_id) 

			res.status(201).json(updatedGroup)
		} catch (err) { 
			handleError(err, req, res)
		} 
	} 

	async function handleDeleteGameFromGroup(req, res) {
		try { 

			let game_id = req.query.game_id 
			let group_id = req.params.id 

			await services.deleteGameFromGroup(group_id, game_id) 

			res.status(204).json(await services.getGroupDetails(group_id))

		} catch (err) {
			handleError(err, req, res)
		}
	}

	// Serve the API documents
	router.use('/docs', openApi.serve);
	router.get('/docs', openApi.setup(openApiSpec));


	// PATHS HANDLING \\
	// Resource: /games
	router.get('/games', handleGamesQueries);

	// Resource: /groups
	router.get('/groups/', handleGetGroups)
	router.get('/groups/:id', handleGetGroupById)
	router.post('/groups/', handleCreateGroup)
	router.delete('/groups/:id', handleDeleteGroup)
	router.put('/groups/', handleEditGroup)

	// Resource: '/groups/games'
	router.post('/groups/:id/games',handleAddGameToGroup)
	router.delete('/groups/:id/games', handleDeleteGameFromGroup)


	// Resource: /users
	router.post('/users/', handleCreateUser)

	return router;
};