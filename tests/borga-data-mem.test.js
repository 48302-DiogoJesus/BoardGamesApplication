const dataMem = require('../borga-data-mem')

test('Change group name if new name is empty', () => {
    dataMem.createGroup(3, "Old Group")
    try {
        dataMem.changeGroupName(3, "")
    } catch (err) {
        expect(err.code).toBe(207)
    }
    dataMem.cleanGroups()
})

test('Change group name if new name is not empty', () => {
    dataMem.createGroup(3, "Old Group")
    let newName = "New Group Name"
    dataMem.changeGroupName(3, newName)
    expect(dataMem.getGroup(3).name).toBe(newName)
    dataMem.cleanGroups()
})