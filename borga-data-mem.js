'use strict'

const error = require('./borga-errors')
const crypto = require('crypto')

// Users Structure \\
// Example of a User:
/* 
'sadjhKYDSAYDHkjhds' : {
        username : "Zé",
        groups : [1, 33]
    }
*/
const users = {
    
}

// Groups structure \\
// Example of a Group:
/*
    1 : {
        owner: 'Manuel'
        name : 'A Group',
        description: 'A description of the group',
        games: {
            'JASDH79sd' : {
                id : 'JASDH79sd', 
                name: 'Root',
                url: 'http://www.google.com', 
                price: '45.4'
            },
            'KLFGJK8' : {
                id : 'KLFGJK8', 
                name: 'Something',
                url: 'http://www.facebook.com', 
                price: '25.4'
            }
        }
    }
*/
var groups = {
    
}

// Quickly Test functions inside this modules
async function test() {
    try {
    } catch (err) {

    }
}
test()

/*---------------------- Group functions ------------------------*/

/**
 * Checks if group exists 
 * @param {group_id} Group ID
 * @returns true if group exists or false if not
 */
async function groupExists(group_id){
    return groups[group_id] != null
}

/**
 * Checks if group has a Game by its ID
 * @param {group_id} Group ID
 * @param {search_game_id} Game id to search for
 * @returns true if any game inside group has that [game_id] or false if not
 */
async function groupHasGame(group_id, search_game_id) {
    if (!(await groupExists(group_id))) return false
    return groups[group_id].games[search_game_id] != undefined
}

/**
 * Changes the name of a group
 * @param {group_id} Group ID
 * @param {new_name} New group name
 * @returns [new_name] if group name is changed successfuly
 */
async function changeGroupName(group_id, new_name){
    if(!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    const group = groups[group_id]
    if (new_name === '') throw error.DATA_MEM_INVALID_GROUP_NAME
    group.name = new_name
    return new_name
}

/**
 * Changes a Group description
 * @param {group_id} Group ID
 * @param {new_description} New description for that group
 * @returns [new_description] if description is changes successfuly
 */
async function changeGroupDescription(group_id, new_description) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    const group = groups[group_id]
    if (new_description === '') throw error.DATA_MEM_INVALID_GROUP_DESCRIPTION
    group.description = new_description
    return new_description
}

/**
 * Get a group object
 * @param {group_id} Group ID
 * @returns the group object identified by group_id
 */
async function getGroup(group_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    return groups[group_id]
}  

/**
 * Get all groups
 */
 async function getGroups() {
    let getGroups = []
    for (let group_id of Object.keys(groups)) {
        getGroups.push(await getGroupDetails(group_id))
    } 
    return getGroups
 }

/**
 * Creates new group
 * @param {group_name} New group name
 * @returns the id of the group if it is created successfuly
 */
async function createGroup(group_name, group_description){
    if (group_name === "") throw error.DATA_MEM_INVALID_GROUP_NAME
    if (group_description === "") throw error.DATA_MEM_INVALID_GROUP_DESCRIPTION
    let newID = Object.keys(groups).length + 1
    groups[newID] = {
        'name' : group_name,
        'description': group_description,
        'games' : {}
    }
    if (await groupExists(newID)) return newID; else return false
}

/**
 * Delete a Group
 * @param {group_id} identifier of a group
 * @returns true if group got deleted successfuly
 */
async function deleteGroup(group_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    delete groups[group_id]
    // Make sure group got deleted
    if (await groupExists(group_id)) throw error.DATA_MEM_GROUP_NOT_DELETED; else return true
}

/**
 * Deletes a Game from a Group
 * @param {group_id} Group ID
 * @param {game_id} Game IF
 * @returns true if that group game was deleted
 */
async function deleteGameFromGroup(group_id, game_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (!(await groupHasGame(group_id, game_id))) throw error.DATA_MEM_GROUP_DOES_NOT_HAVE_GAME
    // Remove game from games list
    delete groups[group_id].games[game_id];
    if (await groupHasGame(group_id, game_id)) throw error.DATA_MEM_GAME_NOT_DELETED_FROM_GROUP; else return true
}

/**
 * Add a Game to a Group
 * @param {group_id} Group ID
 * @param {new_game} New Game object
 * @returns [new_game_ID] if game is successfuly added to group
 */
async function addGameToGroup(group_id, new_game) {
    if (! (await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupHasGame(group_id, new_game.id)) throw error.DATA_MEM_GROUP_ALREADY_HAS_GAME
    groups[group_id].games[new_game.id] = new_game
    if (!(await groupHasGame(group_id, new_game.id))) throw error.DATA_MEM_COULD_NOT_ADD_GAME_TO_GROUP; else return new_game.id
}

/**
 * Get a list of all Group Games
 * @param {group_id} Group ID
 * @returns list with all games from that group
 */
async function getGroupGameNames(group_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    let gamesGroup = []
    let originalGroupGames = groups[group_id].games
    for (let game_id of Object.keys(originalGroupGames)) {
        gamesGroup.push(originalGroupGames[game_id].name)
    }
    return gamesGroup 

}

async function getGroupDetails(group_id){
    
    if(! (await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST 
    
    let current_group = await getGroup(group_id) 
    
    let array_games = await getGroupGameNames(group_id) 

    return { 
        'name': current_group.name, 
        'description': current_group.description, 
        'games': array_games 
    }
}
/*---------------------- User functions ------------------------*/ 
/**
 * Checks if a user exists inside users by its ID
 * @param {user_id} User ID 
 * @returns true if user exists or false if not
 */
async function userExists(user_id){
    return users[user_id] != null
}

/**
 * Check if a user has a group by its ID
 * @param {user_id} User ID
 * @param {search_group_id} ID of the group to search for
 * @returns true if user has that group or false if not
 */
async function userHasGroup(user_id, search_group_id) {
    if (!(await userExists(user_id))) return false
    return users[user_id].groups.includes(search_group_id) 
}

/**
 * Creates a new user 
 * @param {username} Username for the new user to create 
 * @returns user of the new ID if user is created successfuly or throws exception
 */
async function createUser(username){
    if (username === "") throw error.DATA_MEM_INVALID_USERNAME
    let newID = crypto.randomUUID()
    users[newID] = {
        'username' : username,
        'groups' : []
    }
    if (await userExists(newID)) return newID; else return error.DATA_MEM_COULD_NOT_CREATE_USER
}

/**
 * Deletes a user
 * @param {user_id} User ID 
 * @returns true if user is deleted successfuly or throws exception
 */
async function deleteUser(user_id){
    if (!(await userExists(user_id))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    delete users[user_id]
    // Make sure user got deleted
    if (await userExists(user_id)) throw error.DATA_MEM_USER_COULD_NOT_BE_DELETED; else return true
}

/**
 * Get a list of all user names
 * @returns a list with all user names
 */
async function getUsers() {
    return Object.keys(users).map(user_id => {
        return users[user_id].username
    })
}

/**
 * Gets a user object identified by an ID
 * @param {user_id} User ID 
 * @returns the user object
 */
async function getUser(user_id){
    if (!(await userExists(user_id))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    return users[user_id]
}

/**
 * Associate a group to a user
 * @param {user_id} User ID
 * @param {group_id} Id of group we are associating
 */
async function addGroupToUser(user_id, group_id){
    if (!(await userExists(user_id))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await userHasGroup(user_id, group_id)) throw error.DATA_MEM_USER_ALREADY_HAS_THIS_GROUP
    users[user_id].groups.push(group_id) 
    if (!(await userHasGroup(user_id, group_id))) throw error.DATA_MEM_COULD_NOT_ADD_GROUP_TO_USER; else return group_id
}

/**
 * Deletes a group from a user
 * @param {user_id} user_id 
 * @param {group_id} group_id 
 * @returns true if group is disassociated from user
 */
async function deleteGroupFromUser(user_id, group_id) {
    if (!(await userExists(user_id))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    if (!(await userHasGroup(user_id,group_id))) throw error.DATA_MEM_USER_DOES_NOT_HAVE_THIS_GROUP
    // Remove group from users list 
    let user_groups = users[user_id].groups 
    user_groups.splice(user_groups.indexOf(group_id), 1);
    if (await userHasGroup(user_id, group_id)) throw error.DATA_MEM_GROUP_NOT_DELETED_FROM_USER; else return true
}

/**
 * Get all groups from a user
 * @param {user_id} User ID 
 * @returns list with all groups [user_id] is associated with
 */
async function getUserGroups(user_id) {
    if (!(await userExists(user_id))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    await deleteUnexistingGroups()
    console.log(user_id)
    console.log(users[user_id])
    return users[user_id].groups.map(group_id => {
        return groups[group_id]
    })
}

/**
 * Delete unexisting groups from all users groups list
 */
async function deleteUnexistingGroups() {
    for (let user of Object.values(users)) {
        user.groups = await user.groups.map(async group_id => {
            if (await groupExists(group_id)) return group_id
        }).filter(group_id => group_id !== undefined)
    }
} 

module.exports = {
    // Group functions
    changeGroupName : changeGroupName,
    changeGroupDescription : changeGroupDescription,
    createGroup : createGroup,
    deleteGroup : deleteGroup,
    
    getGroup : getGroup,
    getGroups : getGroups,

    deleteGameFromGroup : deleteGameFromGroup,
    addGameToGroup : addGameToGroup,
    getGroupGameNames : getGroupGameNames,
    groupHasGame: groupHasGame, 

    getGroupDetails: getGroupDetails, 

    // User functions
    createUser: createUser,
    deleteUser : deleteUser,
    getUser : getUser,
    addGroupToUser : addGroupToUser,
    deleteGroupFromUser : deleteGroupFromUser,
    getUserGroups : getUserGroups,
    userHasGroup : userHasGroup
}
