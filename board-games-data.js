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

// Quickly Test functions inside this modules
async function test() {

}
test()

// AUXILIARY FUNCTIONS \\

/**
 * Builds the correct query for the server
 * @param {command} string with command name
 * @param {args} string with command arguments
 * @returns a string with a query string. Ex: https://api.boardgameatlas.com/api/search?client_id=ABC&command=[args]
 */
function buildQueryURL(command, args) {
    if (Object.keys(COMMANDS).includes(command)) {
        if (args == undefined) return COMMANDS[command]
        return `${COMMANDS[command]}${args}`
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
    return fetch(BOARD_GAMES_URI)
        .catch(_=> {throw error.EXT_API_UNAVAILABLE})
        .then(res=> {
            if (res.status == 403) throw error.EXT_API_NOT_FOUND
            return
        })
}

/**
 * Filter all the unnecessary properties of a game taking into consideration
 * the domain of our application
 * @param {game} object with all the information 
 * @returns object containing only the needed information for this application
 */
function buildGame(game) {
    return {
        id: game.id,
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
    .catch(_=> {throw error.EXT_API_UNEXPECTED_RESPONSE})
    .then(res => res.json())
    
}

// MAIN FUNCTIONS \\

/**
 * Get Top 10 popular games
 * @returns a promise with a list containing information about every game in the top 10 popularity ranking or an error passed before
 */
async function getPopularGamesList(n) {
    return fetchFromServer("search_games")
    .catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
    .then(data => {
        let games = data.games
        if (games == undefined) throw error.EXT_API_UNEXPECTED_RESPONSE
        // Extract the Top n Games
        return buildGames(games.slice(0,n))
    }).catch(err => {throw error.GLOBAL_UNKNOWN_ERROR(err)})
}

/**
 * Get a game object from a Game ID
 * @returns a promise with a game object or an error passed before
 */
async function getGameById(id) {
    return fetchFromServer("search_game_id", id)
        .catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
        .then(data => {
            if (data.count == 0) throw error.EXT_API_NOT_FOUND
            let game = data.games[0]
            return buildGame(game)
        }).catch(_ => {throw error.EXT_API_NOT_FOUND})
}

/**
 * Get a game object from a Game name search
 * @param {name} string to search for in the API by using the query "name=[name]"
 * @returns a promise with a list of the first 10 game objects obtained by searching for [name]
 */
async function getGamesListByName(name) {
    return fetchFromServer("search_game_name", name)
    .catch(err => err) // Capture the error throwed by "fetchFromServer and pass it on"
    .then(data => {
        if (data.count == 0) throw error.EXT_API_NOT_FOUND
        let games = data.games
        return buildGames(games.slice(0, 14))
    }).catch(_ => {throw error.EXT_API_NOT_FOUND})
}

async function getGameByName(name) {
    return (await getGameByName(name))[0]
}

module.exports = {
    getGameById,
    getGamesListByName,
    getGameByName,
    getPopularGamesList
}
