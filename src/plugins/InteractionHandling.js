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
    if (await Interaction.isStoped()) return;

    await ValidationHandling(main, Command, Interaction, next);
    if (await Interaction.isStoped()) return;

    if (Command.global) {
      global = await Command.global(undefined, Interaction);
    }

    if (await Interaction.isStoped()) return;


    if (type === 2) {
      const SubCommand = main.getCommand(GroupChildName);
      if (!SubCommand.interaction) return;

      if (global && global.interaction) {
        Interaction.Command.Child = SubCommand;
        Interaction.GroupName = GroupName;
        Interaction.GroupChildName = GroupChildName;
        let subGlobal

        if (SubCommand.global) {
          subGlobal = await SubCommand.global(undefined, Interaction, global.interaction);
        }

        if (subGlobal && subGlobal.interaction) {
          SubCommand.interaction(Interaction, subGlobal?.interaction);
        } else if (subGlobal && !subGlobal.message) {
          return
        } else if (!subGlobal) {
          SubCommand.interaction(Interaction, null);
        };

        // return SubCommand.interaction(Interaction, global.interaction);
      } else if (global && !global.interaction) {
        return;
      } else {
        Interaction.Command.Child = SubCommand;
        Interaction.GroupName = GroupName;
        Interaction.GroupChildName = GroupChildName;
        let subGlobal

        if (SubCommand.global) {
          subGlobal = await SubCommand.global(undefined, Interaction, null);
        }

        if (subGlobal && subGlobal.interaction) {
          SubCommand.interaction(Interaction, subGlobal?.interaction);
        } else if (subGlobal && !subGlobal.message) {
          return
        } else if (!subGlobal) {
          SubCommand.interaction(Interaction, null);
        };

        // return SubCommand.interaction(Interaction, null);
      };

      return
    }

    if (type === 1) {
      const SubCommand = main.getCommand(GroupName);
      if (!SubCommand.interaction) return;

      if (global && global.interaction) {
        Interaction.Command.Child = SubCommand;
        Interaction.GroupName = GroupName;
        let subGlobal

        if (SubCommand.global) {
          subGlobal = await SubCommand.global(undefined, Interaction, global.interaction);
        }

        if (subGlobal && subGlobal.interaction) {
          SubCommand.interaction(Interaction, subGlobal?.interaction);
        } else if (subGlobal && !subGlobal.message) {
          return
        } else if (!subGlobal) {
          SubCommand.interaction(Interaction, null);
        };
        
        return 
      } else if (global && !global.interaction) {
        return;
      } else {
        Interaction.Command.Child = SubCommand;
        Interaction.GroupName = GroupName;
        let subGlobal

        if (SubCommand.global) {
          subGlobal = await SubCommand.global(undefined, Interaction, null);
        }

        if (subGlobal && subGlobal.interaction) {
          SubCommand.interaction(Interaction, subGlobal?.interaction);
        } else if (subGlobal && !subGlobal.message) {
          return
        } else if (!subGlobal) {
          SubCommand.interaction(Interaction, null);
        };
        return 
      };
    }

    if (global && global.interaction) {
      Interaction.Command.interaction(Interaction, global?.interaction);
    } else if (global && !global.interaction) {
      return;
    } else {
      Interaction.Command.interaction(Interaction, null);
    }

  });

}