'use strict'

function delay(secs){
    return new Promise(resolve => setTimeout(resolve, secs*1000))
} 

var inQueue = 0

// 2 SECONDS BETWEEN EACH GLOBAL REQUEST (FROM ALL USERS)
async function waitQueue() {
    // Get in queue
    inQueue++
    // Wait in queue for (no of people in queue * 1.5) seconds 
    await delay(inQueue * 1.5)
    // Get out of queue
    inQueue--
    return
}

module.exports.wait = waitQueue
