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

    if (Command.Application.sensitive && Command.OrginName !== message.OrginCmdName) return;

    if (!Command.run && !Command.global) return;

    let global = null;

    const next = await CommandExecuteHandling(message, Command);

    const GroupName = message[0]?.toLowerCase();
    const GroupChildName = message[1]?.toLowerCase();

    message.GroupName = GroupName;
    message.GroupChildName = GroupChildName;

    if (Command.disabed || (Command.owners && !message.author.isOwner)) return;

    await CooldownHandling(message, Command);
    if (await message.isStoped()) return;

    await ValidationHandling(main, Command, message, next);
    if (await message.isStoped()) return;

    const subs = message.Command.Application.Subs[0];

    if (Command.global) {
      global = await Command.global(message);
    };

    // return console.log(message.Command.Application.Subs[0])

    if (subs) {
      const commandGroup = subs.commandGroup?.toLowerCase();
      const commandName = subs.commandName?.toLowerCase();

      let args = message.content.slice(main.prefix.length).split(/ +/g)
      args.shift()

      if (GroupName && GroupChildName && commandGroup && commandName && GroupName === commandGroup && commandName === GroupChildName) args = args.slice(2);
      if (GroupName === commandName) args = args.slice(1);

      for (const i in args) message[i] = args[i]

      if (GroupName && GroupChildName && commandGroup && commandName && GroupName === commandGroup && commandName === GroupChildName) {
        const SubCommand = main.getCommand(GroupChildName);

        if (!SubCommand.run) return

        if (global && global.message) {

          SubCommand.run(message, global?.message);
          message.Command.Child = SubCommand;
          message.GroupName = GroupName;
          message.GroupChildName = GroupChildName;

        } else if (global && !global.message) {
          return
        } else if (!global) {
          SubCommand.run(message, null);
          message.Command.Child = SubCommand;
          message.GroupName = GroupName;
          message.GroupChildName = GroupChildName;
        };

        return;

      } else if (GroupName === commandName) {
        const SubCommand = main.getCommand(GroupName);
        if (!SubCommand.run) return;
        if (global && global.message) {
          SubCommand.run(message, global?.message);
          message.Command.Child = SubCommand;
          message.GroupName = GroupName;
        } else if (global && !global.message) {
          return
        } else if (!global) {
          SubCommand.run(message, null);
          message.Command.Child = SubCommand;
          message.GroupName = GroupName;
        };

        return;

      }
    } else {
      if (global && global.message) {
        Command.run(message, global?.message);
      } else if (global && !global.message) {
        return
      } else if (!global) {
        Command.run(message, null);
      }
    }



  });
}