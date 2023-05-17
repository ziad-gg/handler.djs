const { Client, Collection, Events } = require('discord.js');

const Eventer = new Array()

/**
 * 
 * @param {Client} client 
 */
module.exports.set = (client) => {
   
  client.on(Events.InteractionCreate, (Interaction) => {
    const interaction = Interaction;

    if (interaction.isButton()) {
        const events = Eventer.filter(e => e.name === 'ButtonClick');
        if (Array.isArray(events)) events.forEach(event => event.run(interaction));
        else events.run?.(interaction)
    };

    if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu()) {
        const events = Eventer.filter(e => e.name === 'SelectMenu');
        if (Array.isArray(events)) events.forEach(event => event.run(interaction));
        else events.run?.(interaction)
    };

    if (interaction.isModalSubmit()) {
        const events = Eventer.filter(e => e.name === 'ModelSubmit');
        if (Array.isArray(events)) events.forEach(event => event.run(interaction));
        else events.run?.(interaction)
    };

  });

};

/**
 * 
 * @param {Client} client 
*/
module.exports.addEvents = (event) => {
  Eventer.push({name: event.name, run: event.run})
}