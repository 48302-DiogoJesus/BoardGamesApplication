'use strict';



module.exports = function (games_data, data_mem) {

	// Juntar external e internal e exportar

	/*------------------------------------------------------------ */
	async function addGameToGroup(group_ID, game_ID){ 
		try {
			let gameToAdd = await games_data.getGameById(game_ID) 
			data_mem.addGroupGame(group_ID, gameToAdd) 
		} catch (err) { return err }
		return game_ID
	}
	/*---------------------------------------------------------------*/
	return {
		// GAMES DATA RELATED FUNCTIONS
		getGameById : games_data.getGameById,
		getGamesListByName : games_data.getGamesListByName,
		getPopularGamesList : games_data.getPopularGamesList,
		// DATA MEM RELATED FUNCTIONS
		changeGroupName : data_mem.changeGroupName,
		changeGroupDescription : data_mem.changeGroupDescription,
    	createGroup : data_mem.createGroup,
	
    	deleteGroup : data_mem.deleteGroup,
    	deleteGroupGame : data_mem.deleteGroupGame,
    	addGroupGame : data_mem.addGroupGame,

    	getGroupGames : data_mem.getGroupGames,
		groupHasGame : data_mem.groupHasGame,
		getGroup : data_mem.getGroup,
		getGroups : data_mem.getGroups,
		getGroupDetails: data_mem.getGroupDetails, 


		// USER RELATED FUNCTIONS
		createUser: data_mem.createUser,
		deleteUser : data_mem.deleteUser,
		getUser : data_mem.getUser,
		addGroupToUser : data_mem.addGroupToUser,
		deleteGroupFromUser : data_mem.deleteGroupFromUser,
		getUserGroups : data_mem.getUserGroups, 

		//services functions game-mem 
		 addGameToGroup
	};
}