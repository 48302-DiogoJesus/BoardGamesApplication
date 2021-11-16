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
