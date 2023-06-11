const { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js');
const CommandBuiler = require('../managers/CommandBuilder.js');

module.exports = async function (Application, cmds) {
  if (!cmds || cmds.length === 0) return;

  // const MainCommandsBuildersArray = [];
  // const Commands = [];



  const MainCommands = cmds.filter(cmd => !cmd.Application.isSub);

  MainCommands.forEach(command => {

    command.Application.Subs.forEach(sub => {
      /** @type {CommandBuiler} */
      const Command = Application.commands.get(sub.commandName);

      if (!Command) {
        throw new Error('Could Find The Command');
      }

      if (!Command.Application.isSub) {
        throw new Error('Command must be seted As A sub command');
      }

      const cloneCommand = Object.assign({}, Command);

      if (sub.commandGroup) {
        cloneCommand.Application.setSubGroupName(sub.commandGroup)
      };

      command.Application.mergeCommands(cloneCommand)
    });

  });


  const Allcommands = MainCommands.map(cmd => cmd.builder);

  await Application.REST_API.REST.put(Application.REST_API.Routes.applicationCommands(Application.client.user.id), { body: Allcommands });
};