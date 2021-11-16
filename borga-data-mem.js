'use strict'

const error = require('./borga-errors')

const groups = {
    1 : {
        name : "Meu grupo",
        games : ['aJHA87BH', 'asjkdh8GHSGD', 'dkjasgjdh89DSHG']
    },
    2 : {
        name : "Meu grdupo",
        games : ['aJHA8asd7BH', 'asjkasddh8GHSGD']
    }
}

// GROUPS MANAGEMENT \\

function groupExists(group_ID){
    if(groups[group_ID] != null) return true; else return false
}

function groupHasGame(group_ID, game_ID) {
    if (!groupExists(group_ID)) return false
    if (groups[group_ID].games.includes(game_ID)) return true; else return false
}

function changeGroupName(group_ID, new_name){

    if(!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST

    const group = groups[group_ID]

    group.name = new_name

    return new_name
}


function createGroup(group_ID, group_name){

    if(groupExists(group_ID)) throw error.DATA_MEM_GROUP_ALREADY_EXISTS

    groups[group_ID] = {
        'name' : group_name,
        'games' : []
    }
    return group_ID
}

/**
 * Delete a Games Group
 * @param {group_ID} identifier of a group
 * @returns true if group got deleted or false if group doesn't exist or couldn't be deleted 
 */
function deleteGroup(group_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    delete groups[group_ID]
    // Make sure group got deleted
    if (groupExists(group_ID)) throw error.DATA_MEM_GROUP_NOT_DELETED; else return true
}

function deleteGroupGame(group_ID, game_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (!groupHasGame(group_ID, game_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_HAVE_GAME
    const index = groups[group_ID].games.indexOf(game_ID);
    if (index > -1) groups[group_ID].games.splice(index, 1)
    if (groupHasGame(group_ID, game_ID)) throw error.DATA_MEM_GAME_NOT_DELETED_FROM_GROUP; else return true
}

function getGroupGames(group_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    return groups[group_ID].games
}

function addGroupGame(group_ID, new_game_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (groupHasGame(group_ID, new_game_ID)) throw error.DATA_MEM_GROUP_ALREADY_HAS_GAME

    groups[group_ID].games.push(new_game_ID)
    return true
}
