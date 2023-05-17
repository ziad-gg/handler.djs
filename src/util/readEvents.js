const Application = require('../structures/Application.js');
const readPath = require('./readPath.js');
const path = require('node:path');
const Event = require('../structures/EventBuilder.js');
const Interaction = require('../Handlers/HandlerEvents.js');
const Eventer = require('../Handlers/Interactions.js');
/**
 * 
 * @param {String} pathManeger 
 * @param {Application} main 
 */

module.exports = async function (pathManeger, main, client) {
    const files = await readPath(pathManeger);
    const CustomEvents = [];

    for await (const file of files) {
        /** @type {Event} */
        const event = require(path.join(file));
        if (!event instanceof Event) throw new Error("Error path is not a constructor");
        if (!event.name) throw new Error("missing Event name");
        if (!event.run) throw new Error("missing Event execution");
        Interaction(event, client)
    };


    Eventer.set(client)
    // client.emit("clientReady", client);
}