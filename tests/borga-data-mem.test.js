const dataMem = require('../borga-data-mem')

// createGroup
test('Create group with empty name', () => {
    let newGroupID = dataMem.createGroup()
    try {
        dataMem.getGroup(newGroupID)
    } catch (err) {
        expect(err.code).toBe(207)
    }
    dataMem.cleanGroups()
})

test('Create group with valid name', () => {
    let newGroupID = dataMem.createGroup("New Valid Group Name")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        name: "New Valid Group Name",
        games: []
    })
    dataMem.cleanGroups()
})

// getGroup
test('Get group that does not exist', () => {
    try {
        dataMem.getGroup(2)
    } catch (err) {
        expect(err.code).toBe(201)
        return
    }
    dataMem.cleanGroups()
})


test('Get object from valid group', () => {
    let newGroupID = dataMem.createGroup("New Group")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        'name': 'New Group',
        games: []
    })
    dataMem.cleanGroups()
})

// changeGroupName
test('Change group name if new name is empty', () => {
    let groupID = dataMem.createGroup("Old Group")
    try {
        dataMem.changeGroupName(groupID, "")
    } catch (err) {
        expect(err.code).toBe(207)
        return
    }
    dataMem.cleanGroups()
})

test('Change group name if new name is not empty', () => {
    let groupID = dataMem.createGroup("Old Group")
    let newName = "New Group Name"
    dataMem.changeGroupName(groupID, newName)
    expect(dataMem.getGroup(groupID).name).toBe(newName)
    dataMem.cleanGroups()
})

test('Change group name from group that does not exist', () => {
    try {
        dataMem.changeGroupName(1, "Something")
    } catch (err) {
        expect(err.code).toBe(201)
        return
    }
    dataMem.cleanGroups()
})