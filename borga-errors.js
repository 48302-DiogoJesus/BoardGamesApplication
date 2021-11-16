'use strict';

// All known errors are contained inside this object
module.exports = {
    BGATLAS_UNAVAILABLE: {
        code: 101,
        message: 'Board Game Altas API is currently offline'
    },
    BGATLAS_UNEXPECTED_RESPONSE: {
        code: 102,
        message: 'Board Game Atlas API gave an unexpected response'
    },
    BGATLAS_NOT_FOUND: {
        code: 103,
        message: 'Invalid Board Game Atlas ID'
    },
    DATA_MEM_GROUP_DOES_NOT_EXIST: {
        code: 201,
        message: 'Group does not exist' 
    },
    DATA_MEM_GROUP_ALREADY_EXISTS: {
        code: 202,
        message: 'Group already exists'
    },
    DATA_MEM_GROUP_NOT_DELETED: {
        code: 203,
        message: 'Group could not be deleted'
    },
    DATA_MEM_GROUP_DOES_NOT_HAVE_GAME: {
        code: 204,
        message: 'Group does not have that game'
    },
    DATA_MEM_GAME_NOT_DELETED_FROM_GROUP: {
        code: 205,
        message: 'Game could not be deleted from group' 
    },
    DATA_MEM_GROUP_ALREADY_HAS_GAME: {
        code: 206,
        message: 'Game is already inside that group'
    }

};