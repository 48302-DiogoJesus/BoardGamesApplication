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
// CREATE, DELETE, EDIT(NAME,GAMES(DELETE, ADD, LIST_ALL))

function groupExists(group_ID){
    if(groups[group_ID] != null) return true; else return false
}

function groupHasGame(group_ID, game_ID) {
    if (!groupExists(group_ID)) return false
    if (groups[group_ID].games.includes(game_ID)) return true; else return false
}

function changeNameFromGroup(group_ID, new_name){

    if(!groupExists(groupID)) return false

    const group = groups[groupID]

    if(group == null) return false

    group.name = new_name
}


function createGroup(group_ID, group_name){

    if(!groupExists(group_ID)){
        groups[group_ID] = {
            'name' : group_name,
            'games' : []
        }
    }
    else{
        console.log("This group already exists!")
    }
}

/**
 * Delete a Games Group
 * @param {group_ID} identifier of a group
 * @returns true if group got deleted or false if group doesn't exist or couldn't be deleted 
 */
function deleteGroup(group_ID) {
    if (!groupExists(group_ID)) return false
    delete groups[group_ID]
    // Make sure group got deleted
    if (groupExists(group_ID)) return false; else return true
}

function deleteGameFromGroup(group_ID, game_ID) {
    if (!groupExists(group_ID)) return false
    if (!groupHasGame(group_ID, game_ID)) return false
    const index = groups[group_ID].games.indexOf(game_ID);
    if (index > -1) groups[group_ID].games.splice(index, 1)
    if (groupHasGame(group_ID, game_ID)) return false; else return true
}
