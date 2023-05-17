const { Message, Client, GatewayDispatchEvents } = require('discord.js');
const Application = require('../structures/Application.js');
const InteractionBuilder = require('../managers/InteractonBuilder.js');

const CooldownHandling = require('./CooldownHandling.js');
const ValidationHandling = require('./ValidationHandling.js');
const CommandExecuteHandling = require('./CommandExecuteHandling.js');

/**
 * @param {Message} message 
 * @param {Client} client
 * @param {Application} main
 */

module.exports = async function (client, main) {

 client.api.on(GatewayDispatchEvents.InteractionCreate, async (data) => {
    const Interaction = new InteractionBuilder(client, data, main).run();
    if (!Interaction.isCmd || ( Interaction.isCmd && !Interaction.Command.int )) return;
    Interaction.args();

    const Command = main.getCommand(Interaction.cmdName);
    if (!Command.interaction) return;

    const next = await CommandExecuteHandling(Interaction, Command);

    if (Command.disabed || (Command.owners && !message.author.isOwner)) return;

    let global = null;

    if (Command.global) {
      global = await Command.global(undefined, Interaction);
      if (!global.interaction) throw new Error("Global function must return a value for interaction Execution");
    };

    await CooldownHandling(Interaction, Command);
    if (await Interaction.isStoped()) return;

    await ValidationHandling(main, Command, Interaction, next);
    if (await Interaction.isStoped()) return;

    Interaction.Command.interaction(Interaction, global?.interaction);

 });


}