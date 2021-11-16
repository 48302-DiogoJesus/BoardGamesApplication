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
function groupExists(groupID){
    if(groups[groupID] != null) return true; else return false
}
