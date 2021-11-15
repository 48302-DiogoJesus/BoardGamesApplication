'use strict';

// All known errors are contained inside this object
module.exports = {
    BGATLAS_UNAVAILABLE: {
        code: 1,
        message: 'Board Game Altas API is currently offline'
    },
    BGATLAS_UNEXPECTED_RESPONSE : {
        code: 2,
        message: 'Board Game Atlas API gave an unexpected response'
    },
    BGATLAS_INVALID_ID : {
        code: 3,
        message: 'Invalid Board Game Atlas ID'
    }
};