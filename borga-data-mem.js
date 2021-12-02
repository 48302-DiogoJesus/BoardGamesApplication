'use strict'

const error = require('./borga-errors')

var users = {
    // TEST USER FOR POSTMAN REQUESTS
    "Zé" : {
        groups : []
    }
}
// Users Structure \\
// Example of a User:
/* 
"Zé" : {
    groups : [1, 33]
}
*/

var tokens = {
    // TEST TOKEN FOR POSTMAN REQUESTS
    '4chwViN4QHCTyTnUud88ww': 'Zé'
}
// Example of a token object
/* 
'4chwViN4QHCTyTnUud88ww': 'Zé'
*/

// Groups structure \\
// Example of a Group:
/*
    1 : {
        owner: 'Manuel',
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

/* ------------------------------------ GROUPS ------------------------------------ */

/**
 * Checks if group exists 
 * @param {group_id} Group ID
 * @returns true if group exists or false if not
 */
async function groupExists(group_id){
    return groups[group_id] != null
}

async function groupOwner(group_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    return groups[group_id].owner
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
 * @param {username} Username of the user trying to modify content
 * @param {group_id} Group ID
 * @param {new_name} New group name
 * @returns [new_name] if group name is changed successfuly
 */
async function changeGroupName(username, group_id, new_name){
    if(!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
    const group = groups[group_id]
    if (new_name === '') throw error.DATA_MEM_INVALID_GROUP_NAME
    group.name = new_name
    return new_name
}

/**
 * Changes a Group description
 * @param {username} Username of the user trying to modify content
 * @param {group_id} Group ID
 * @param {new_description} New description for that group
 * @returns [new_description] if description is changes successfuly
 */
async function changeGroupDescription(username, group_id, new_description) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
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
 * Get all groups informations (group games contains only their names)
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
 * @param {username} Username of the user creating group
 * @param {group_name} New group name
 * @returns the id of the group if it is created successfuly
 */
async function createGroup(username, group_name, group_description){
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    if (group_name === "") throw error.DATA_MEM_INVALID_GROUP_NAME
    if (group_description === "") throw error.DATA_MEM_INVALID_GROUP_DESCRIPTION
    let newID = Object.keys(groups).length
    groups[newID] = {
        'owner' : username,
        'name' : group_name,
        'description': group_description,
        'games' : {}
    }
    if (!await groupExists(newID)) throw error.DATA_MEM_COULD_NOT_CREATE_GROUP
    await addGroupToUser(username, newID)
    return newID
}

/**
 * Delete a Group from global Groups object
 * @param {username} Username of the user trying to modify content
 * @param {group_id} identifier of a group
 * @returns true if group got deleted successfuly
 */
async function deleteGroup(username, group_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
    delete groups[group_id]
    // Make sure no user makes reference to unexisting groups
    await deleteUnexistingGroupsFromUsers(group_id)
    // Make sure group got deleted
    if (await groupExists(group_id)) throw error.DATA_MEM_GROUP_NOT_DELETED; else return true
}

/**
 * Deletes a Game from a Group
 * @param {username} Username of the user trying to modify content
 * @param {group_id} Group ID
 * @param {game_id} Game ID
 * @returns true if that group game was deleted
 */
async function deleteGameFromGroup(username, group_id, game_id) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
    if (!(await groupHasGame(group_id, game_id))) throw error.DATA_MEM_GROUP_DOES_NOT_HAVE_GAME
    // Remove game from games list
    delete groups[group_id].games[game_id];
    if (await groupHasGame(group_id, game_id)) throw error.DATA_MEM_GAME_NOT_DELETED_FROM_GROUP; else return true
}

/**
 * Add a Game to a Group
 * @param {username} Username of the user trying to modify content
 * @param {group_id} Group ID
 * @param {new_game} New Game object
 * @returns [new_game_ID] if game is successfuly added to group
 */
async function addGameToGroup(username, group_id, new_game) {
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
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

/**
 * Get user friendly group
 * @param {group_id} Group ID
 * @returns game object but the games array contains the names of the games instead of game objects
 */
async function getGroupDetails(group_id){
    if(!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST 
    let current_group = await getGroup(group_id) 
    let array_games = await getGroupGameNames(group_id) 
    return { 
        ...current_group,
        'games': array_games 
    }
}

/* ------------------------------------ USERS ------------------------------------ */
/**
 * Checks if a user exists inside users by its username
 * @param {username} Username to identify the user 
 * @returns true if user exists or false if not
 */
async function userExists(username){
    return users[username] != undefined
}

/**
 * Check if a user has a group by its ID
 * @param {username} Username to identify the user 
 * @param {search_group_id} ID of the group to search for
 * @returns true if user has that group or false if not
 */
async function userHasGroup(username, search_group_id) {
    if (!(await userExists(username))) return false
    console.log(users[username].groups)
    return users[username].groups.includes(parseInt(search_group_id)) 
}

/**
 * Creates a new user 
 * @param {username} Username for the new user to create 
 * @param {token} New Token to link the user to ( Generated by web-api )
 * @returns user of the new ID ifuser is created successfuly or throws exception
 */
async function createUser(username, token){
    if (username === "" || !username) throw error.DATA_MEM_INVALID_USERNAME
    if (token === "" || !token) throw error.GLOBAL_INVALID_TOKEN
    if (await userExists(username)) throw error.DATA_MEM_USER_ALREADY_EXISTS
    tokens[token] = username
    users[username] = {
        'groups' : []
    }
    if (await userExists(username)) return token; else return error.DATA_MEM_COULD_NOT_CREATE_USER
}

/**
 * Deletes a user
 * @param {username} Username to identify the user 
 * @returns true if user is deleted successfuly or throws exception
 */
async function deleteUser(username){
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    delete users[username]
    // Make sure user got deleted
    if (await userExists(username)) throw error.DATA_MEM_USER_COULD_NOT_BE_DELETED; else return true
}

/**
 * Get a list of all user names
 * @returns a list with all user names
 */
async function getUserNames() {
    return Object.keys(users)
}

/**
 * Gets a user object identified by an ID
 * @param {username} Username to identify the user 
 * @returns the user object
 */
async function getUser(username){
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    return users[username]
}

/**
 * Associate a group to a user
 * Different users can have each others groups
 * @param {username} Username to identify the user 
 * @param {group_id} Id of group we are associating
 */
async function addGroupToUser(username, group_id){
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    if (!(await groupExists(group_id))) throw error.DATA_MEM_GROUP_DOES_NOT_EXIST
    if (await userHasGroup(username, group_id)) throw error.DATA_MEM_USER_ALREADY_HAS_THIS_GROUP
    users[username].groups.push(group_id) 
    if (!(await userHasGroup(username, group_id))) throw error.DATA_MEM_COULD_NOT_ADD_GROUP_TO_USER; else return username
}

/**
 * Deletes a group reference from a specific user
 * @param {username} Username to identify the user 
 * @param {group_id} group_id 
 * @returns true if group is disassociated from user
 */
async function deleteGroupFromUser(username, group_id) {
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    // COMMENTED BECAUSE WE WANT THE USER TO BE ABLE TO HAVE GROUPS FROM OTHER USERS
    // INSIDE HIS PERSONAL GROUPS
    // if (await groupOwner(group_id) !== username) throw error.GLOBAL_NOT_AUTHORIZED
    if (!(await userHasGroup(username,group_id))) throw error.DATA_MEM_USER_DOES_NOT_HAVE_THIS_GROUP
    // Remove group from users list 
    let user_groups = users[username].groups 
    user_groups.splice(user_groups.indexOf(group_id), 1);
}

/**
 * Get all groups from a user
 * @param {username} Username to identify the user 
 * @returns list with all groups [user_id] is associated with
 */
async function getUserGroups(username) {
    if (!(await userExists(username))) throw error.DATA_MEM_USER_DOES_NOT_EXIST
    return users[username].groups.map(group_id => {
        return groups[group_id]
    })
}

/**
 * Delete unexisting groups from all users groups list
 * @param {group_id} Group ID
 */
async function deleteUnexistingGroupsFromUsers(group_id) {
    for (let user of Object.keys(users)) {
        await deleteGroupFromUser(user)
    }
} 

/* ------------------------------------ TOKENS ------------------------------------ */
async function tokenToUsername(token) {
    return tokens[token]
}

/* ------------------------------------ TEST FUNCTIONS ------------------------------------ */
async function connectTokenWithUser(token, username) {
    tokens[token] = username
}
async function resetGroups() {
    groups = {}
}
async function resetUsers() {
    users = {}
}
async function resetTokens() {
    tokens = {}
}

module.exports = {
    // Group Functions
    changeGroupName,
    changeGroupDescription,
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,

    // Group Games Functions
    deleteGameFromGroup,
    addGameToGroup,
    getGroupGameNames,
    groupHasGame, 
    getGroupDetails, 

    // User Functions
    createUser,
    deleteUser,
    getUser, 

    // User Group unctions
    addGroupToUser,
    deleteGroupFromUser,
    getUserGroups,
    userHasGroup,

    // Token Functions
    tokenToUsername,

    // Test Functions
    resetGroups,
    resetUsers,
    resetTokens,
    connectTokenWithUser
}
