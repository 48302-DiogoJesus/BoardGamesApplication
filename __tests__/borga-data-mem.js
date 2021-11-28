const borga_data_mem = require('../borga-data-mem')
const board_games_data = require('../board-games-data')
const services = require('../borga-services')(board_games_data, borga_data_mem) 
const error = require('../borga-errors')

// TESTS TEMPLATE FOR borga-data-mem 
/*
test('Description of the test here', () => {

    Examples to validate THIS test: 
    expect(test_value).toBe(null)
    or
    expect(test value).toStrictEqual({
        'name' : 'New Name',
        'games': []
    })
    or 
    https://jestjs.io/docs/expect

    services.deleteGroup()  // To avoid leaving unwanted groups to the next test
})
*/

describe('Group Tests', () => {
    test('Create group with empty name and description', async () => {
        let newGroupID = await services.createGroup()
        try {
            await services.getGroup(newGroupID)
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_INVALID_GROUP_NAME.code)
        }
        await services.deleteGroup(newGroupID)
    })

    test('Create group with valid name', async () => {
        let newGroupID = await services.createGroup("New Valid Group Name", "New group description")
        expect(await services.getGroup(newGroupID)).toStrictEqual({
            name: "New Valid Group Name",
            description: "New group description",
            games: {}
        })
        await services.deleteGroup(newGroupID)
    })

    // getGroup
    test('Get group that does not exist', async () => {
        try {
            await services.getGroup(2)
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })

    test('Get object from valid group', async () => {
        let newGroupID = await services.createGroup("New Group", "New Description")
        expect(await services.getGroup(newGroupID)).toStrictEqual({
            name: "New Group",
            description: "New Description",
            games: {}
        })
        await services.deleteGroup(newGroupID)
    })

    // changeGroupName
    test('Change group name if new name is empty', async () => {
        let groupID = await services.createGroup("Old Group", "New Description")
        try {
            await services.changeGroupName(groupID, "")
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_INVALID_GROUP_NAME.code)
        }
        await services.deleteGroup(groupID)
    })

    test('Change group name if new name is not empty', async () => {
        let groupID = await services.createGroup("Old Group")
        await services.changeGroupName(groupID, "New Group Name")
        expect((await services.getGroup(groupID)).name).toBe("New Group Name")
        await services.deleteGroup(groupID)
    })

    test('Change group name from group that does not exist', async () => {
        try {
            await services.changeGroupName(1, "Something")
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })

    // deleteGroup
    test('Try to delete a non existing group', async () => {
        try {
            await services.deleteGroup("A Group")
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })

    test('Delete an existing group', async () => {
        let newGroupID = await services.createGroup("New Group", "New Description")
        let searchGroup = await services.getGroup(newGroupID)
        expect(searchGroup).toStrictEqual({
            name: "New Group",
            description: "New Description",
            games: {}
        })
        await services.deleteGroup(newGroupID)
        try {
            await services.getGroup(newGroupID)
        } catch (err) {
            // Expect group to not exist anymore
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })
})

describe('Group Games Tests', () => {
    jest.setTimeout(10 * 1000)
    test('Add game to a valid group', async () => {
        let newGroupID = await services.createGroup("New Group", "New Description")
        expect(await services.addGameToGroupByID(newGroupID, 'TAAifFP590')).toBeDefined()
        await services.deleteGroup(newGroupID)
    })
    
    test('Add duplicate game to a group', async () => {
        let newGroupID = await services.createGroup("New Group", "New Description")
        await services.addGameToGroupByID(newGroupID, 'TAAifFP590')
        try {
            await services.addGameToGroupByID(newGroupID, 'TAAifFP590')
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_ALREADY_HAS_GAME.code)
        }
        await services.deleteGroup(newGroupID)
    })
    
    test('Add game to a unexisting group', async () => {
        try {
            await services.addGameToGroupByID(1, 'TAAifFP590')
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })
    
    // getGroupGameNames
    test('Get game names from unexisting group', async () => {
        try {
            await services.getGroupGameNames(1234)
        } catch (err) {
            expect(err.code).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST.code)
        }
    })
    
    // FIX THIS
    test('Get game names from valid group', async () => {
        let groupID = await services.createGroup("New Group", "New Description")
        await services.addGameToGroupByID(groupID, '5H5JS0KLzK')
        await services.addGameToGroupByID(groupID, '8xos44jY7Q')
        expect(JSON.stringify(await services.getGroupGameNames(groupID))).toBe(JSON.stringify(["Wingspan", "Everdell"]))
        await services.deleteGroup(groupID)
    })
    
    // FIX THIS
    test('Delete Group Game from valid group', async () => {
        let groupID = await services.createGroup("New Group", "New Description")
        let game = {
            'id': 'jhadHUIA',
            'name': "First"
        }
        await services.addGameToGroup(groupID, game)
        expect(await services.groupHasGame(groupID, game.id)).toBe(true)
        await services.deleteGameFromGroup(groupID, game.id)
        expect(await services.groupHasGame(groupID, game)).toBe(false)
        await services.deleteGroup(groupID)
    })
})

describe('User Operations Tests ', () => {
    //Create User
    test('Create user', async () => {
        let newUserID = await services.createUser("Miguel")
        expect(await services.getUser(newUserID)).toStrictEqual({
            username : "Miguel",
            groups : []

        })
        await services.deleteUser(newUserID)
    })


    //Delete User
    test('Delete an user', async () => {
        let newUserID = await services.createUser("Quim")
        let getUser = await services.getUser(newUserID)
        expect(getUser).toStrictEqual({
            username : "Quim",
            groups : []
        })
        await services.deleteUser(newUserID)
        try {
            await services.getUser(newUserID)
        } catch (err) {
            // Expect user to not exist anymore
            expect(err.code).toBe(error.DATA_MEM_USER_DOES_NOT_EXIST.code)
        }
    })

    //Associate a group to a user
    test('Add group to a user', async () => {
        let newGroupID = await services.createGroup("A", "B")
        let newUserID = await services.createUser("Manuel")
        let getUser = await services.getUser(newUserID)
        await services.addGroupToUser(newUserID, newGroupID)
        expect(getUser).toStrictEqual({
            username : "Manuel",
            groups : [newGroupID]
        })
        await services.deleteUser(newUserID)
    })

    //Associate a group to a user
    test('Add unexisting group to a user', async () => {
        let newUserID = await services.createUser("Manuel")
        try {
            await services.addGroupToUser(newUserID, 93)
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
        await services.deleteUser(newUserID)
    })

    //Delete group from a user
    test('Delete group from a user', async () => {
        let newGroupID = await services.createGroup("A", "B")
        let newUserID = await services.createUser("Zé")
        await services.addGroupToUser(newUserID, newGroupID)
        expect(await services.userHasGroup(newUserID, newGroupID)).toBe(true)
        await services.deleteGroupFromUser(newUserID, newGroupID)
        expect(await services.userHasGroup(newUserID, newGroupID)).toBe(false)
        await services.deleteUser(newUserID)

    })

    //Get Groups from Users
    test('Get groups id from users', async () => {
        let newUserID = await services.createUser("Filipino")
        let newGroupID = await services.createGroup("Novo Grupo", "nova descrição")
        let newGroupID2 = await services.createGroup("Novo Grupo 2", "nova descrição 2")
        // Only two of the following are actual groups
        await services.addGroupToUser(newUserID, newGroupID2)
        await services.addGroupToUser(newUserID, newGroupID)
        // User will still have groups = [33, 90, 1, 2] even though 33 and 90 do not exist
        // The function below will only return the existing groups and remove others from user groups
        expect((await services.getUserGroups(newUserID)).length).toBe(2)
        await services.deleteUser(newUserID)
    })
})