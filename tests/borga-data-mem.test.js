const dataMem = require('../borga-data-mem')

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
test('Create group with empty name', () => {
    let newGroupID = dataMem.createGroup()
    try {
        dataMem.getGroup(newGroupID)
    } catch (err) {
        expect(err.code).toBe(207)
    }
})

test('Create group with valid name', () => {
    let newGroupID = dataMem.createGroup("New Valid Group Name")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        name: "New Valid Group Name",
        games: []
    })
    dataMem.deleteGroup(newGroupID)
})

// getGroup
test('Get group that does not exist', () => {
    try {
        dataMem.getGroup(2)
    } catch (err) {
        expect(err.code).toBe(201)
        return
    }
})

test('Get object from valid group', () => {
    let newGroupID = dataMem.createGroup("New Group")
    expect(dataMem.getGroup(newGroupID)).toStrictEqual({
        'name': 'New Group',
        games: []
    })
    dataMem.deleteGroup(newGroupID)
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
})

test('Change group name if new name is not empty', () => {
    let groupID = dataMem.createGroup("Old Group")
    let newName = "New Group Name"
    dataMem.changeGroupName(groupID, newName)
    expect(dataMem.getGroup(groupID).name).toBe(newName)
    dataMem.deleteGroup(groupID)
})

test('Change group name from group that does not exist', () => {
    try {
        dataMem.changeGroupName(1, "Something")
    } catch (err) {
        expect(err.code).toBe(201)
        return
    }
})