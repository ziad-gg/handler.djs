const { Message, Client, GatewayDispatchEvents, Events } = require('discord.js');
const Application = require('../structures/Application.js');
const MessageBuilder = require('../managers/MessageBuilder.js');
const CommandBuilder = require('../managers/CommandBuilder.js');
const CooldownHandling = require('./CooldownHandling.js');
const ValidationHandling = require('./ValidationHandling.js');
const CommandExecuteHandling = require('./CommandExecuteHandling.js');

/**
 * 
 * @param {Message} message 
 * @param {Client} client
 * @param {Application} main
 */

module.exports = async function (client, main) {

  client.api.on(GatewayDispatchEvents.MessageCreate, async (data) => {

    const message = new MessageBuilder(client, data, main).run();
    if (message.author.bot || !message.startsWithPrefix || !message.isCmd) return;

    /** @type {CommandBuilder} */
    const Command = main.getCommand(message.cmdName);
    if (!Command.run) return;

    let global = null;


    const next = await CommandExecuteHandling(message, Command);

    if (Command.disabed || (Command.owners && !message.author.isOwner)) return;

    await CooldownHandling(message, Command);
    if (await message.isStoped()) return;

    await ValidationHandling(main, Command, message, next);
    if (await message.isStoped()) return;
    
    if (Command.global) {
      global = await Command.global(message);
      // if (!global.message) throw new Error("Global function must return a value for message Execution");
    };

    if (global && global.message) {
      Command.run(message, global?.message);
    } else if (global && !global.message) {
      return
    } else if (!global) {
      Command.run(message, null);
    }

  });
}