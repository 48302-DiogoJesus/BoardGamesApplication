'use strict';

// Dependencies
require('dotenv').config();

module.exports = function (games_data, data_mem) {

	// Juntar external e internal e exportar

	return {
		// GAMES DATA RELATED FUNCTIONS
		getGameById : games_data.getGameById,
		getGamesListByName : games_data.getGamesListByName,
		getPopularGamesList : games_data.getPopularGamesList,
		// DATA MEM RELATED FUNCTIONS
		changeGroupName : data_mem.changeGroupName,
    	createGroup : data_mem.createGroup,
    	deleteGroup : data_mem.deleteGroup,
    	getGroup : data_mem.getGroup,
    	deleteGroupGame : data_mem.deleteGroupGame,
    	addGroupGame : data_mem.addGroupGame,
    	getGroupGames : data_mem.getGroupGames
	};
}