'use strict'

// Load environment variables from .env file
require('dotenv').config()
const BOARD_GAMES_CLIENT_ID = process.env.ATLAS_CLIENT_ID

// Module Imports
const fetch = require('node-fetch')
const error = require('./borga-errors')

// Base Board Game Atlas URI
const BOARD_GAMES_URI = `https://api.boardgameatlas.com/api/search?client_id=${BOARD_GAMES_CLIENT_ID}&`

// Available commands and their acceptable form to the server
const COMMANDS = {
    // Get one game by its ID
    search_game_id: `${BOARD_GAMES_URI}ids=`,
    // Get all games
    search_games: `${BOARD_GAMES_URI}`,
    // Search for games using a [name]
    search_game_name:`${BOARD_GAMES_URI}name=`
}

// AUXILIARY FUNCTIONS \\

/**
 * Builds the correct query for the server
 * @param {command} string with command name
 * @param {args} string with command arguments
 * @returns a string with a query string. Ex: https://api.boardgameatlas.com/api/search?client_id=ABC&command=[args]
 */
function buildQueryURL(command, args) {
    if (Object.keys(COMMANDS).includes(command)) {
        if (args == undefined) return `${COMMANDS[command]}`
        else return `${COMMANDS[command]}${args}`
    }
    // Invalid Command
    return false
}

/**
 * Checks the Board Game Atlas API availability
 * @param {games} list with game objects
 * @returns a list containing only the needed information about every game inside [games]
 */
async function isAvailable() {
    return fetch(BOARD_GAMES_URI).then(res=> {
        if (res.status == 403) throw error.BGATLAS_INVALID_ID
        return true
    }).catch(_=> {throw error.BGATLAS_UNAVAILABLE})
}

/**
 * Filter all the unnecessary properties of a game taking into consideration
 * the domain of our application
 * @param {game} object with all the information 
 * @returns object containing only the needed information for this application
 */
function buildGame(game) {
    return {
        name: game.name,
        url: game.url,
        price: game.price_text,
        min_age: game.min_age,
        min_players: game.min_players,
        max_players: game.max_players
    }
}

/**
 * Filter all the unnecessary properties from a list of games
 * @param {games} list with game objects
 * @returns a list containing only the needed information about every game inside [games]
 */
function buildGames(games) {
    return games.map(game => {
        return buildGame(game)
    })
}

/**
 * Responsible for direct communication with the Board Game Altas API
 * Verifies if Board Game Atlas Server is available and provide its response formatted correctly
 * @param {command} string with command name
 * @param {args} string with command arguments
 * @returns a promise resolved with a JSON object from response body or rejected with an exception with code '2'
 */
async function fetchFromServer(command, args) {
    // isAvailable automatically ends the execution by throwing an error
    await isAvailable()
    let search_url = buildQueryURL(command, args)
    return fetch(search_url)
    .then(res => res.json())
    .catch(_=> {throw error.BGATLAS_UNEXPECTED_RESPONSE})
}

// MAIN FUNCTIONS \\

/**
 * Get Top 10 popular games
 * @returns a list containing information about every game in the top 10 popularity ranking
 */
async function getPopularGamesList() {
    return fetchFromServer("search_games").then(data => {
        let games = data.games
        if (games == undefined)
            throw error.BGATLAS_UNEXPECTED_RESPONSE
        // Extract the Top 10 Games
        return buildGames(games.slice(0,10))
    }).catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
}

/**
 * Get a game object from a Game ID
 * @returns a game object
 */
async function getGameById(id) {
    return fetchFromServer("search_game_id").then(data => {
        let game = data.games[0]
        if (game == undefined) throw error.BGATLAS_UNEXPECTED_RESPONSE
        return buildGame(game)
    }).catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
}

/**
 * Get a game object from a Game name search
 * @param {name} string to search for in the API by using the query "name=[name]"
 * @returns a list of the first 10 game objects obtained by searching for [name]
 */
async function getGamesListByName(name) {
    return fetchFromServer("search_game_name", name).then(data => {
        let games = data.games
        if (games == undefined) throw error.BGATLAS_UNEXPECTED_RESPONSE
        return buildGames(games.slice(0,10))
    }).catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
}

async function test() {
    // console.log(await getGamesListByName("Pair"))
}
test()