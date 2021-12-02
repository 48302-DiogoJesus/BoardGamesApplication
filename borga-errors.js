'use strict';

/*
* HTTP COMMON ERROR CODES AND MEANING *
1xx Information
2xx Success
3xx Redirection
4xx Client Error
5xx Server Error

200 - OK
201 - RESOURCE CREATED
204 - RESOURCE UPDATED (DELETED TOO)

400 - BAD REQUEST
401 - UNAUTHENTICATED
403 - FORBIDDEN (UNAUTHORIZED)
404 - NOT FOUND
409 - CONFLICT (RESOURCE ALREADY EXISTS)
500 - INTERNAL SERVER ERROR
502 - BAD GATEWAY
503 - SERVICE UNAVAILABLE
*/

// All known errors are contained inside this object
module.exports = {
    GLOBAL_UNKNOWN_ERROR: (info) => {
        return {
            code: 0,
            message: 'Unknown error',
            details: info
        }
    },
    GLOBAL_MISSING_PARAM: {
        code: 1,
        http_code: 400,
        message: 'Missing parameter'
    },
    GLOBAL_NOT_AUTHORIZED: {
        code: 2,
        http_code: 403,
        message: 'Not Authorized'
    },
    GLOBAL_INVALID_TOKEN: {
        code: 3,
        http_code: 400,
        message: 'Invalid token provided'
    },
    EXT_API_UNAVAILABLE: {
        code: 101,
        http_code: 503,
        message: 'Board Game Altas API is currently offline'
    },
    EXT_API_UNEXPECTED_RESPONSE: {
        code: 102,
        http_code: 500,
        message: 'Board Game Atlas API gave an unexpected response'
    },
    EXT_API_NOT_FOUND: {
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
        http_code: 409,
        message: 'Group already exists'
    },
    DATA_MEM_GROUP_NOT_DELETED: {
        code: 203,
        http_code: 500,
        message: 'Group could not be deleted'
    },
    DATA_MEM_GROUP_DOES_NOT_HAVE_GAME: {
        code: 204,
        http_code: 404,
        message: 'Group does not have that game'
    },
    DATA_MEM_GAME_NOT_DELETED_FROM_GROUP: {
        code: 205,
        http_code: 500,
        message: 'Game could not be deleted from group' 
    },
    DATA_MEM_GROUP_ALREADY_HAS_GAME: {
        code: 206,
        http_code: 409,
        message: 'Game is already inside that group'
    },
    DATA_MEM_INVALID_GROUP_NAME: {
        code: 207,
        http_code: 400,
        message: 'Invalid group name'
    },
    DATA_MEM_COULD_NOT_ADD_GAME_TO_GROUP: {
        code: 208,
        http_code: 500,
        message: 'Although group exists and this game is not a duplicate, could not add it to group'
    },
    DATA_MEM_INVALID_GROUP_DESCRIPTION : {
        code: 209,
        http_code: 400,
        message: 'Invalid group description'
    },
    DATA_MEM_COULD_NOT_CREATE_GROUP : {
        code: 210,
        http_code: 500,
        message: 'Could not create group'
    },
    DATA_MEM_INVALID_USERNAME : {
        code: 211,
        http_code: 400,
        message: 'Invalid user name'
    },
    DATA_MEM_COULD_NOT_CREATE_USER : {
        code: 212,
        http_code: 500,
        message: 'Could not create user'
    },
    DATA_MEM_USER_DOES_NOT_EXIST: {
        code: 213,
        http_code: 404,
        message: 'User does not exist'
    },
    DATA_MEM_USER_COULD_NOT_BE_DELETED: {
        code: 214,
        http_code: 500,
        message: 'User could not be deleted'
    },
    DATA_MEM_USER_ALREADY_HAS_THIS_GROUP: {
        code: 215,
        http_code: 409,
        message: 'Group already inside this user groups'
    },
    DATA_MEM_COULD_NOT_ADD_GROUP_TO_USER: {
        code: 216,
        http_code: 500,
        message: 'Could not add group to user'
    },
    DATA_MEM_USER_DOES_NOT_HAVE_THIS_GROUP: {
        code: 217,
        http_code: 404,
        message: 'This user does not have that group'
    },
    DATA_MEM_GROUP_NOT_DELETED_FROM_USER: {
        code: 218,
        http_code: 500,
        message: 'Group was not deleted from user groups'
    },
    DATA_MEM_USER_ALREADY_EXISTS: {
        code: 219,
        http_code: 409,
        message: 'A user with that username already exists'
    },
    WEB_API_INVALID_QUERY: {
        code: 301,
        http_code: 400,
        message: 'Invalid query'
    },
    WEB_API_INVALID_GROUP_DETAILS: {
        code: 302,
        http_code: 400, 
        message: 'Invalid group details'
    },
    WEB_API_INSUFICIENT_GROUP_INFORMATION: {
        code: 303,
        http_code: 400,
        message: 'Insuficient group information'
    },
    WEB_API_INVALID_USER_NAME: {
        code: 304,
        http_code: 400,
        message: 'Invalid user name'
    },
    WEB_API_NOT_AUTHENTICATED: {
        code: 305,
        http_code: 401,
        message: 'Invalid authentication token'
    }
};