const borga_data_mem = require('../borga-data-mem')
const board_games_data = require('../board-games-data')
const mock_board_games_data = require('ext-games-data-mock')

const services = require('../borga-services')(mock_board_games_data, borga_data_mem) 

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

const test_user = "Zé"
const test_token = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

beforeEach(async () => { 
    await services.connectTokenWithUser(test_token, test_user)
    await services.createUser(test_user) 
})
afterEach(async () => await services.resetAll())


describe('Group Tests', () => {

    test('Create group with empty name and description', async () => {
        try {
            await services.executeAuthed(test_token, 'createGroup')
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_INVALID_GROUP_NAME)
        }
    })

    test('Create group with valid details', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "New Valid Group Name", "New group description")
        expect(await services.getGroup(newGroupID)).toBeDefined()
    })

    // getGroup
    test('Get group that does not exist', async () => {
        try {
            await services.getGroup(2)
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })

    // changeGroupName
    test('Change group name if new name is empty', async () => {
        let groupID = await services.executeAuthed(test_token, 'createGroup', "Old Group", "New Description")
        try {
            await services.executeAuthed(test_token, 'changeGroupName', groupID, "")
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_INVALID_GROUP_NAME)
        }
    })

    test('Change group name if new name is not empty', async () => {
        let groupID = await services.executeAuthed(test_token, 'createGroup', "Old Group", "New Description")
        await services.executeAuthed(test_token,'changeGroupName', groupID, "New Group Name")
        expect((await services.getGroup(groupID)).name).toBe("New Group Name")
    })

    test('Change group name from group that does not exist', async () => {
        try {
            await services.executeAuthed(test_token, 'changeGroupName', 1, "Something")
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })

    // deleteGroup
    test('Try to delete a non existing group', async () => {
        try {
            await services.executeAuthed(test_token, 'deleteGroup', "A Group")
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })

    test('Delete an existing group', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "New Group", "New Description")
        await services.executeAuthed(test_token, 'deleteGroup', newGroupID)
        try {
            await services.getGroup(newGroupID)
        } catch (err) {
            // Expect group to not exist anymore
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })
})

describe('Group Games Tests', () => {

    jest.setTimeout(10 * 1500)

    test('Add game to a valid group', async () => {
        await services.createUser(test_user)
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "New Group", "New Description")
        expect(await services.executeAuthed(test_token, 'addGameToGroupByID', newGroupID, 'TAAifFP590')).toBeDefined()
    })
    
    test('Add duplicate game to a group', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "New Group", "New Description")
        await services.executeAuthed(test_token, 'addGameToGroupByID', newGroupID, 'TAAifFP590')
        try {
            await services.executeAuthed(test_token, 'addGameToGroupByID', newGroupID, 'TAAifFP590')
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_ALREADY_HAS_GAME)
        }
    })
    
    test('Add game to a unexisting group', async () => {
        try {
            await services.executeAuthed(test_token, 'addGameToGroupByID', 1, 'TAAifFP590')
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })
    
    // getGroupGameNames
    test('Get game names from unexisting group', async () => {
        try {
            await services.getGroupGameNames(1234)
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })
    
    // FIX THIS
    test('Get game names from valid group', async () => {
        let groupID = await services.executeAuthed(test_token, 'createGroup', "New Group", "New Description")
        await services.executeAuthed(test_token, 'addGameToGroupByID', groupID, '898yJDStpO8X')
        await services.executeAuthed(test_token, 'addGameToGroupByID', groupID, 'yqR4PtpO8X')
        expect(JSON.stringify(await services.getGroupGameNames(groupID))).toBe(JSON.stringify(["Testing Game 3", "Testing Game"]))
    })
    
    // FIX THIS
    test('Delete Group Game from valid group', async () => {
        let groupID = await services.executeAuthed(test_token, 'createGroup', "New Group", "New Description")
        let game = {
            'id': 'jhadHUIA',
            'name': "First"
        }
        await services.executeAuthed(test_token, 'addGameToGroup', groupID, game)
        expect(await services.groupHasGame(groupID, game.id)).toBe(true)
        await services.executeAuthed(test_token, 'goupHasGame', groupID, game.id)
        expect(await services.groupHasGame(groupID, game)).toBe(false)
    })
})

describe('User Operations Tests ', () => {

    // Create User
    test('Create user', async () => {
        await services.createUser("Miguel")
        expect(await services.getUser("Miguel")).toBeDefined()
    })

    // Delete Existing User
    test('Delete an existing user', async () => {
        await services.createUser("Quim")
        try {
            await services.getUser("Quim")
            await services.executeAuthed(test_token, 'deleteUser', "Quim")
        } catch (err) {
            // Expect user to have been deleted successfully
            expect(err).toBe(error.DATA_MEM_USER_DOES_NOT_EXIST)
        }
    })

    // Delete Unexisting User
    test('Delete an unexisting user', async () => {
        try {
            await services.executeAuthed(test_token, 'deleteUser', "Quim")
        } catch (err) {
            // Expect user to not exist anymore
            expect(err).toBe(error.DATA_MEM_USER_DOES_NOT_EXIST)
        }
    })

    // Associate a group to a user
    test('Add group to a user', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "A", "B")
        await services.executeAuthed(test_token, 'addGroupToUser', newGroupID)
        let getUser = await services.getUser(test_user)
        expect(getUser.groups.includes(newGroupID)).toBe(true)
    })

    //Associate a group to a user
    test('Add unexisting group to a user', async () => {
        await services.createUser("Manuel")
        try {
            await services.executeAuthed(test_token, 'addGroupToUser', 93)
        } catch (err) {
            expect(err).toBe(error.DATA_MEM_GROUP_DOES_NOT_EXIST)
        }
    })

    //Delete group from a user
    test('Delete group from a user', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "A", "B")
        await services.executeAuthed(test_token, 'addGroupToUser', newGroupID)
        expect(await services.userHasGroup(test_user, newGroupID)).toBe(true)
        await services.executeAuthed(test_token, 'deleteGroupFromUser', newGroupID)
        expect(await services.userHasGroup(test_token, newGroupID)).toBe(false)
    })

    //Get Groups from Users
    test('Get groups id from users', async () => {
        let newGroupID = await services.executeAuthed(test_token, 'createGroup', "Novo Grupo", "nova descrição")
        let newGroupID2 = await services.executeAuthed(test_token, 'createGroup', "Novo Grupo 2", "nova descrição 2")
        // Only two of the following are actual groups
        await services.executeAuthed(test_token, 'addGroupToUser', newGroupID2)
        await services.executeAuthed(test_token, 'addGroupToUser', newGroupID)
        // User will still have groups = [33, 90, 1, 2] even though 33 and 90 do not exist
        // The function below will only return the existing groups and remove others from user groups
        expect((await services.getUserGroups(test_user)).length).toBe(2)
    })
})