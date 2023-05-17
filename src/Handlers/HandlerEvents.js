const { Client, Events } = require('discord.js');
const Eventer = require('../Handlers/Interactions.js');

/**
 * 
 * @param {Client} client 
 */

module.exports = async function (event, client) {
    if (event.name === 'ButtonClick' || event.name === 'ModelSubmit' || event.name === 'SelectMenu') Eventer.addEvents(event) 
    else event.once? main.client.once(event.name, (...args) => event.run(...args)) : client.on(event.name, (...args) => event.run(...args));
};