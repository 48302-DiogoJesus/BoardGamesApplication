const dataMem = require('../borga-data-mem')
const error = require('../borga-errors')

// TESTS TEMPLATE FOR borga-data-mem 
/*
test('Description of the test here', () => {

    Examples to validate THIS test: 
    expect(test value).toBe(null)
    or
    expect(test value).toStrictEqual({
        'name' : 'New Name',
        'games': []
    })
    or 
    https://jestjs.io/docs/expect

    dataMem.deleteGroup()  // To avoid leaving unwanted groups to the next test
})
*/

// createGroup
test('Create group with empty name and description', () => {
    let newGroupID = dataMem.createGroup()
    try {
        dataMem.getGroup(newGroupID)
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_INVALID_GROUP_NAME.code)
    }
    dataMem.deleteGroup(newGroupID)
})

test('Create group with valid name', () => {
    let newGroupID = dataMem.createGroup("New Valid Group Name", "New group description")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        name: "New Valid Group Name",
        description: "New group description",
        games: {}
    })
    dataMem.deleteGroup(newGroupID)
})

// getGroup
test('Get group that does not exist', () => {
    try {
        dataMem.getGroup(2)
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

test('Get object from valid group', () => {
    let newGroupID = dataMem.createGroup("New Group", "New Description")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        name: "New Group",
        description: "New Description",
        games: {}
    })
    dataMem.deleteGroup(newGroupID)
})

// changeGroupName
test('Change group name if new name is empty', () => {
    let groupID = dataMem.createGroup("Old Group", "New Description")
    try {
        dataMem.changeGroupName(groupID, "")
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_INVALID_GROUP_NAME.code)
    }
    dataMem.deleteGroup(groupID)
})

test('Change group name if new name is not empty', () => {
    let groupID = dataMem.createGroup("Old Group")
    dataMem.changeGroupName(groupID, "New Group Name")
    expect(dataMem.getGroup(groupID).name).toBe("New Group Name")
    dataMem.deleteGroup(groupID)
})

test('Change group name from group that does not exist', () => {
    try {
        dataMem.changeGroupName(1, "Something")
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

// deleteGroup
test('Try to delete a non existing group', () => {
    try {
        dataMem.deleteGroup("A Group")
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

test('Delete an existing group', () => {
    let newGroupID = dataMem.createGroup("New Group", "New Description")
    let searchGroup = dataMem.getGroup(newGroupID)
    expect(searchGroup).toStrictEqual({
        name: "New Group",
        description: "New Description",
        games: {}
    })
    dataMem.deleteGroup(newGroupID)
    try {
        dataMem.getGroup(newGroupID)
    } catch (err) {
        // Expect group to not exist anymore
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

// addGroupGame

test('Add duplicate game to a group', () => {
    let newGroupID = dataMem.createGroup("New Group", "New Description")
    dataMem.addGroupGame(newGroupID, 'sdabasdj834238')
    try {
        dataMem.addGroupGame(newGroupID, 'sdabasdj834238')
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_ALREADY_HAS_GAME.code)
    }
    dataMem.deleteGroup(newGroupID)
})

test('Add game to a unexisting group', () => {
    try {
        dataMem.addGroupGame(1, 'sdabasdj834238')
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

test('Add game to a valid group', () => {
    let newGroupID = dataMem.createGroup("New Group", "New Description")
    expect(dataMem.addGroupGame(newGroupID, {
        id: 'jhadHUIA',
        name : 'SomeName'
    })).toBe('jhadHUIA')
    dataMem.deleteGroup(newGroupID)
})

// getGroupGameNames
test('Get game names from unexisting group', () => {
    try {
        dataMem.getGroupGameNames(1234)
    } catch (err) {
        expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
    }
})

test('Get game names from valid group', () => {
    let groupID = dataMem.createGroup("New Group", "New Description")
    dataMem.addGroupGame(groupID, {
        'id': 'jhadHUIA',
        'name': "First"
    })
    dataMem.addGroupGame(groupID, {
        'id': 'jhsdadHUIA',
        'name': "Second"
    })
    expect(JSON.stringify(dataMem.getGroupGameNames(groupID))).toBe(JSON.stringify(["First", "Second"]))
    dataMem.deleteGroup(groupID)
})

// deleteGroupGame
test('Delete Group Game from valid group', () => {
    let groupID = dataMem.createGroup("New Group", "New Description")
    let game = {
        'id': 'jhadHUIA',
        'name': "First"
    }
    dataMem.addGroupGame(groupID, game)
    expect(dataMem.groupHasGame(groupID, game.id)).toBe(true)
    dataMem.deleteGroupGame(groupID, game.id)
    expect(dataMem.groupHasGame(groupID, game)).toBe(false)
    dataMem.deleteGroup(groupID)
})