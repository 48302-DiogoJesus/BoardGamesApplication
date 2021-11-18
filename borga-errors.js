'use strict';

// All known errors are contained inside this object
module.exports = {
    GLOBAL_UNKNOWN_ERROR: (info) => {
        return {
            code: 0,
            message: 'Unknown error',
            details: info
        }
    },
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
        http_code: 404,
        message: 'Invalid Board Game Atlas Game'
    },
    DATA_MEM_GROUP_DOES_NOT_EXIST: {
        code: 201,
        http_code: 404,
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
        http_code: 404,
        message: 'Group does not have that game'
    },
    DATA_MEM_GAME_NOT_DELETED_FROM_GROUP: {
        code: 205,
        message: 'Game could not be deleted from group' 
    },
    DATA_MEM_GROUP_ALREADY_HAS_GAME: {
        code: 206,
        message: 'Game is already inside that group'
    },
    DATA_MEM_INVALID_GROUP_NAME: {
        code: 207,
        message: 'Invalid group name'
    },
    DATA_MEM_COULD_NOT_ADD_GAME_TO_GROUP: {
        code: 208,
        message: 'Although group exists and this game is not a duplicate, could not add it to group'
    },
    DATA_MEM_INVALID_GROUP_DESCRIPTION : {
        code: 209,
        message: 'Invalid group description'
    },
    DATA_MEM_COULD_NOT_CREATE_GROUP : {
        code: 210,
        message: 'Could not create group'
    },
    WEB_API_INVALID_QUERY: {
        code: 301,
        message: 'Invalid query'
    },
    WEB_API_INVALID_GROUP_DETAILS: {
        code: 302,
        message: 'Invalid group details'
    }
};