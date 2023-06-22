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
    if (!Interaction.isCmd || (Interaction.isCmd && !Interaction.Command.int)) return;
    Interaction.args();

    const Command = main.getCommand(Interaction.cmdName);
    if (!Command.interaction && !Command.global) return;

    const next = await CommandExecuteHandling(Interaction, Command);

    const GroupName = Interaction.GroupName;
    const GroupChildName = Interaction.GroupChildName;
    const type = Interaction.ResponseType;

    Interaction.GroupName = GroupName;
    Interaction.GroupChildName = GroupChildName;

    if (Command.disabed || (Command.owners && !Interaction.author.isOwner)) return;

    let global = null;

    await CooldownHandling(Interaction, Command);
    if (Interaction.isStoped()) return;

    await ValidationHandling(main, Command, Interaction, next);
    if (Interaction.isStoped()) return;

    if (Command.global) {
      global = Command.global(undefined, Interaction);
    }

    if (Interaction.isStoped()) return;


    if (type === 2) {
      const SubCommand = main.getCommand(GroupChildName);

      Interaction.Command.Child = SubCommand;
      Interaction.GroupName = GroupName;
      Interaction.GroupChildName = GroupChildName;

      if (SubCommand?.interaction) SubCommand.interaction(Interaction, SubCommand?.global?.(undefined, Interaction, global));
      else SubCommand.global(undefined, Interaction, global)

      return;
    }

    if (type === 1) {
      const SubCommand = main.getCommand(GroupName);
      if (!SubCommand?.interaction) return;

      Interaction.Command.Child = SubCommand;
      Interaction.GroupName = GroupName;

      if (SubCommand?.interaction) SubCommand.interaction(Interaction, SubCommand.global(undefined, Interaction, global));
      else SubCommand.global(undefined, Interaction, global)
      return
    };
    
    Interaction.Command?.interaction?.(Interaction, global);

  });

}