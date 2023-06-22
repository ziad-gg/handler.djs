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

    if (!message.commandFromCut && Command.Application.sensitive && Command.OrginName !== message.OrginCmdName) return;
    if (message.commandFromCut && message.withPrefix && !message.content.includes(message.Application.prefix)) return;
    if (message.commandFromCut && !message.withPrefix && message.content.includes(message.Application.prefix)) return;

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

    /** @type {Array<{ commandGroup: string, commandName: string }>} */
    const SubCommandDecleration = message.Command.Application.Subs;

    let subs = SubCommandDecleration?.find(sub => sub.commandGroup?.toLowerCase() === GroupName && (GroupChildName ? sub.commandName === GroupChildName : true));
    if (!subs) subs = SubCommandDecleration.find(op => op.commandName.toLowerCase() === GroupName && !op.commandGroup);

    if (SubCommandDecleration.length > 0 && !subs) return;


    if (Command.global) {
      global = Command.global(message);
    };

    if (await message.isStoped()) return;

    if (subs) {

      const commandGroup = subs.commandGroup?.toLowerCase();
      const commandName = subs.commandName?.toLowerCase();

      let args = message.content.slice(main.prefix.length).split(/ +/g)
      args.shift()

      if (GroupName && GroupChildName && commandGroup && commandName && GroupName === commandGroup && commandName === GroupChildName) args = args.slice(2);
      if (GroupName === commandName) args = args.slice(1);

      if (args.length > 0) {
        for (const i in args) message[i] = args[i];
      } else {
        for (let i = 0; i <= 10; i++) {
          message[i] = undefined;
          message[i.toString()] = undefined;
        }
      };

      if (GroupName && GroupChildName && commandGroup && commandName && GroupName === commandGroup && commandName === GroupChildName) {

        const SubCommand = main.getCommand(GroupChildName);


        message.Command.Child = SubCommand;
        message.GroupName = GroupName;
        message.GroupChildName = GroupChildName;

        if (SubCommand.run) SubCommand.run(message, SubCommand?.global?.(message, undefined, global));
        else SubCommand?.global?.(message, undefined, global);

        return;

      } else if (GroupName === commandName) {
        const SubCommand = main.getCommand(GroupName);

        message.Command.Child = SubCommand;
        message.GroupName = GroupName;
  
        if (SubCommand.run) SubCommand.run(message, SubCommand?.global?.(message, undefined, global));
        else SubCommand?.global?.(message, undefined, global);

        return
      }
    } else {
      message.Command?.run?.(message, global);
    };


  });
}