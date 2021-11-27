'use strict';

module.exports = function (data_ext, data_int) {

	// Juntar external e internal e exportar

	/*------------------------------------------------------------ */
	async function addGameToGroupByID(group_ID, game_ID){ 
		try {
            let gameToAdd = await data_ext.getGameById(game_ID) 
            data_int.addGameToGroup(group_ID, gameToAdd) 
			return data_int.getGroupDetails(group_ID)
        } catch (err) { return err }
    }
	
	/*---------------------------------------------------------------*/
	return {
		// GAMES DATA RELATED FUNCTIONS
		getGameById : data_ext.getGameById,
		getGamesListByName : data_ext.getGamesListByName,
		getPopularGamesList : data_ext.getPopularGamesList,
		// DATA MEM RELATED FUNCTIONS
		changeGroupName : data_int.changeGroupName,
		changeGroupDescription : data_int.changeGroupDescription,
    	createGroup : data_int.createGroup,
	
    	deleteGroup : data_int.deleteGroup,
    	deleteGameFromGroup : data_int.deleteGameFromGroup,

    	getGroupGames : data_int.getGroupGames,
		groupHasGame : data_int.groupHasGame,
		getGroup : data_int.getGroup,
		getGroups : data_int.getGroups,
		getGroupDetails: data_int.getGroupDetails, 


		// USER RELATED FUNCTIONS
		createUser: data_int.createUser,
		deleteUser : data_int.deleteUser,
		getUser : data_int.getUser,
		addGroupToUser : data_int.addGroupToUser,
		deleteGroupFromUser : data_int.deleteGroupFromUser,
		getUserGroups : data_int.getUserGroups, 
		userHasGroup: data_int.userHasGroup,

		// EXCLUSIVE SERVICES FUNCTIONS (USE BOTH DATA_INT AND DATA_EXT)
		addGameToGroupByID
	};
}