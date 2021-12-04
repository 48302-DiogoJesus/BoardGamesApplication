'use strict';

const errors = require('./borga-errors');

module.exports = function (data_ext, data_int) {

	/*------------------------------------------------------------ */
	async function executeAuthed(token, function_name, ...args) {
		try {
			if (!token) throw errors.GLOBAL_INVALID_TOKEN
			// Dont execute if operation does not require a authentication token
			if (!Object.keys(auth_imports).includes(function_name)) return null

			// Make sure a username associated with [token] exists
			let username = await getUsername(token)
			if (!username) throw errors.GLOBAL_INVALID_TOKEN

			// Call requested function with proper username and arguments
			return auth_imports[function_name](username, ...args)
		} catch (err) { throw err }
	}

	async function addGameToGroupByID(username, group_id, game_id){ 
		try {
            let game = await data_ext.getGameById(game_id) 
            await data_int.addGameToGroup(username, group_id, game)
			return (await data_int.getGroupDetails(group_id))
        } 
		// Pass error to next layer
		catch (err) { throw err }
    }

	/**
	 * Get a username from it's token
	 * @param {token} Authentication token able to identify a user
	 * @returns username
	 */
	async function getUsername(token) {
		try {
			if (!token) throw errors.GLOBAL_INVALID_TOKEN
			return (await data_int.tokenToUsername(token))
		} 
		// Pass error to next layer
		catch (err) { throw err }
	}

	/**
	 * Deletes a username (Same as the one who makes the request)
	 * @param {token} Authorization token
	 * @param {username} Username of the user to delete
	 */
	async function deleteUser(token, username) {
		try {
			let this_username = await getUsername(token)	
			if (!this_username) throw errors.DATA_MEM_USER_DOES_NOT_EXIST
			// To avoid user A trying to delete user B
			if (this_username !== username) throw errors.GLOBAL_NOT_AUTHORIZED
			await data_int.deleteUser(username)
		} catch (err) { throw err }
	}
	

	// Not exported since all this functions are executed from "this.executeAuthed()"
	const auth_imports = {
		// GROUP FUNCTIONS
		createGroup : data_int.createGroup,
		deleteGroup : data_int.deleteGroup,
		changeGroupName : data_int.changeGroupName,
		deleteGameFromGroup : data_int.deleteGameFromGroup,

		// USER GROUP FUNCTIONS
		addGameToGroup : data_int.addGameToGroup, 
		addGroupToUser : data_int.addGroupToUser,
		deleteGroupFromUser : data_int.deleteGroupFromUser,
		addGameToGroupByID,

		// USER FUNCTIONS 
		deleteUser
	}

	const non_auth_imports = {
		// GAMES DATA RELATED FUNCTIONS
		getGameById : data_ext.getGameById,
		getGamesListByName : data_ext.getGamesListByName,
		getGameByName :  data_ext.getGameByName,
		getPopularGamesList : data_ext.getPopularGamesList,		

		// GROUP GAMES FUNCTIONS
    	getGroupGameNames : data_int.getGroupGameNames,
		groupHasGame : data_int.groupHasGame,
		getGroup : data_int.getGroup,
		getGroups : data_int.getGroups,
		getGroupDetails : data_int.getGroupDetails, 
		getGroupGameNames : data_int.getGroupGameNames,

		// USER GROUPS
		userHasGroup: data_int.userHasGroup,
		getUserGroups : data_int.getUserGroups, 

		// USER FUNCTIONS
		createUser: data_int.createUser,
		getUser : data_int.getUser, 
		

		// TOKEN FUNCTIONS
		tokenToUsername : data_int.tokenToUsername,

		// EXCLUSIVE SERVICES FUNCTIONS
		getUsername
	}

	const test_imports = {
		// RESET FUNCTIONS
		resetGroups : data_int.resetGroups,
		resetUsers : data_int.resetUsers,
		resetTokens : data_int.resetTokens,
		resetAll : async () => {
			await data_int.resetGroups();
			await data_int.resetUsers();
			await data_int.resetTokens();
		}
	}
	/*---------------------------------------------------------------*/
	return {
		...non_auth_imports,
		...test_imports,
		executeAuthed
	};
}