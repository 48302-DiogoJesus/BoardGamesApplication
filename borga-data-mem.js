'use strict'

const error = require('./borga-errors')
/*
const users = {
    'sadjhKYDSAYDHkjhds' : {
        groups : []
    }
}
*/
// Groups structure \\
// Just an Example
var groups = {
    1 : {
        name : 'A Group',
        description: 'A description of the group',
        games: {
            'JASDH79sd': {
                id : 'JASDH79sd', 
                name: 'Root',
                url: 'http://www.google.com', 
                price: '45.4'
            },
            'KLFGJK8': {
                id : 'KLFGJK8', 
                name: 'Something',
                url: 'http://www.facebook.com', 
                price: '25.4'
            }
        }
    }
}

// Quickly Test functions inside this modules
async function test() {
    
}
test()

/**
 * Checks if group exists 
 * @param {group_ID} Group ID
 * @returns true if group exists or false if not
 */
function groupExists(group_ID){
    return groups[group_ID] != null
}

/**
 * Checks if group has a Game by its ID
 * @param {group_ID} Group ID
 * @param {search_game_id} Game id to search for
 * @returns true if any game inside group has that [game_id] or false if not
 */
function groupHasGame(group_id, search_game_id) {
    if (!groupExists(group_id)) return false
    return groups[group_id].games[search_game_id] != null
}

/**
 * Changes the name of a group
 * @param {group_ID} Group ID
 * @param {new_name} New group name
 * @returns [new_name] if group name is changed successfuly
 */
function changeGroupName(group_ID, new_name){
    if(!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    const group = groups[group_ID]
    if (new_name === '') throw error.DATA_MEM_INVALID_GROUP_NAME
    group.name = new_name
    return new_name
}

/**
 * Changes a Group description
 * @param {group_ID} Group ID
 * @param {new_description} New description for that group
 * @returns [new_description] if description is changes successfuly
 */
function changeGroupDescription(group_ID, new_description) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    const group = groups[group_ID]
    if (new_description === '') throw error.DATA_MEM_INVALID_GROUP_DESCRIPTION
    group.description = new_description
    return new_description
}

/**
 * Get a group object
 * @param {group_id} Group ID
 * @returns the group object identified by group_id
 */
function getGroup(group_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    return groups[group_ID]
}

/**
 * Creates new group
 * @param {group_name} New group name
 * @returns the id of the group if it is created successfuly
 */
function createGroup(group_name, group_description){
    if (group_name === "") throw error.DATA_MEM_INVALID_GROUP_NAME
    if (group_description === "") throw error.DATA_MEM_INVALID_GROUP_DESCRIPTION
    let newID = Object.keys(groups).length + 1
    groups[newID] = {
        'name' : group_name,
        'description': group_description,
        'games' : {}
    }
    if (groupExists(newID)) return newID; else return false
}

/**
 * Delete a Games Group
 * @param {group_ID} identifier of a group
 * @returns true if group got deleted successfuly
 */
function deleteGroup(group_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    delete groups[group_ID]
    // Make sure group got deleted
    if (groupExists(group_ID)) throw error.DATA_MEM_GROUP_NOT_DELETED; else return true
}

/**
 * Deletes a Game from a Group
 * @param {group_ID} Group ID
 * @param {game_ID} Game IF
 * @returns true if that group game was deleted
 */
function deleteGroupGame(group_ID, game_ID) {
    if (!groupExists(group_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (!groupHasGame(group_ID, game_ID)) throw error.DATA_MEM_GROUP_DOES_NOT_HAVE_GAME
    // Remove game from games list
    delete groups[group_ID].games[game_ID];
    if (groupHasGame(group_ID, game_ID)) throw error.DATA_MEM_GAME_NOT_DELETED_FROM_GROUP; else return true
}

/**
 * Add a Game to a Group
 * @param {group_id} Group ID
 * @param {new_game} New Game object
 * @returns [new_game_ID] if game is successfuly added to group
 */
 function addGroupGame(group_id, new_game) {
    if (!groupExists(group_id)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (groupHasGame(group_id, new_game.id)) throw error.DATA_MEM_GROUP_ALREADY_HAS_GAME
    groups[group_id].games[new_game.id] = new_game
    if (!groupHasGame(group_id, new_game.id)) throw error.DATA_MEM_COULD_NOT_ADD_GAME_TO_GROUP; else return new_game.id
}

/**
 * Get a list of all Group Games
 * @param {group_id} Group ID
 * @returns list with all games from that group
 */
function getGroupGameNames(group_id) {
    if (!groupExists(group_id)) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    let gamesGroup = []
    let originalGroupGames = groups[group_id].games
    for (let game_id of Object.keys(originalGroupGames)) {
        gamesGroup.push(originalGroupGames[game_id].name)
    }
    return gamesGroup
}

module.exports = {
    // Group functions
    changeGroupName : changeGroupName,
    changeGroupDescription : changeGroupDescription,
    createGroup : createGroup,
    deleteGroup : deleteGroup,
    getGroup : getGroup,
    // Group Games functions
    deleteGroupGame : deleteGroupGame,
    addGroupGame : addGroupGame,
    getGroupGameNames : getGroupGameNames,
    groupHasGame: groupHasGame
}
