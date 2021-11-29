
const error = require('../borga-errors')

const games = {
    'yqR4PtpO8X' : {
        "id": "yqR4PtpO8X",
        "name": "Testing Game",
        "url": "https://www.boardgameatlas.com/game/TAAifFP590/root",
        "price": "55.99",
        "min_age": 10,  
        "min_players": 2,
        "max_players": 4
    },
    'yqRDAPDA' : {
        "id": "yqRDAPDA",
        "name": "Testing Game 2",
        "url": "https://www.boardgameatlas.com/game/TAAifFP590/root",
        "price": "55.99",
        "min_age": 10,  
        "min_players": 2,
        "max_players": 4
    },
    '898yJDStpO8X' : {
        "id": "898yJDStpO8X",
        "name": "Testing Game 3",
        "url": "https://www.boardgameatlas.com/game/TAAifFP590/root",
        "price": "55.99",
        "min_age": 10,  
        "min_players": 2,
        "max_players": 4
    },
    'yqSHDAJO8X' : {
        "id": "yqSHDAJO8X",
        "name": "Testing Game 4",
        "url": "https://www.boardgameatlas.com/game/TAAifFP590/root",
        "price": "55.99",
        "min_age": 10,  
        "min_players": 2,
        "max_players": 4
    }
}

const queries = {
    "Some Game": [
        {
            "id": "yqSHDAJO8X",
            "name": "Some Game",
            "url": "https://www.boardgameatlas.com/game/TAAifFP590/root",
            "price": "23.99",
            "min_age": 4,  
            "min_players": 1,
            "max_players": 4
        },
        {
            "id": "yqSHDasdasdX",
            "name": "Some Query Game 4",
            "url": "https://www.boardgameatlas.com/game/asdifFP590/root",
            "price": "55.99",
            "min_age": 10,  
            "min_players": 2,
            "max_players": 4
        }
    ]
}

async function getGameById(game_id) {
    let game = games[game_id]
    if (game == null) throw error.BGATLAS_NOT_FOUND
    return game
}

async function getGamesListByName(name) {
    return queries[name]
}
const getPopularGamesList = getGamesListByName

async function getGameByName(name) {
    return queries[name][0]
}

module.exports = {
    getGameById,
    getGamesListByName,
    getGameByName,
    getPopularGamesList,		
}