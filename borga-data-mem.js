'use strict'

const error = require('./borga-errors')

const groups = {
    1 : {
        name : "Meu grupo",
        games : ['aJHA87BH', 'asjkdh8GHSGD']
    }
}

// GROUPS MANAGEMENT \\
// CREATE, DELETE, EDIT(NAME,GAMES(DELETE, ADD, LIST_ALL))

/**
 * Delete a Games Group
 * @param {group_ID} identifier of a group
 * @returns true if group got deleted or false if group doesn't exist or couldn't be deleted 
 */
function deleteGroup(group_ID) {
    if (!groupExits(group_ID)) return false
    delete groups[group_ID]
    // Make sure group got deleted
    if (groupExits(group_ID)) return false; else return true
}
