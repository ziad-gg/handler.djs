const { SlashCommandBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require('../../src');

module.exports = new CommandBuilder()
.setName('Set')
.setDescription('set command')
.InteractionOn(new SlashCommandBuilder())
.setCooldown("5s")
.setGlobal(GlobalExecute)
.isSensitive()
.setAliases([ 
  { cut: 's' } 
])
.setSubcommands([ 
  {command: 'delete' }, 
  {command: 'edit' }, 
  {command: 'delete', group: 'user'}, 
  {command: 'edit', group: 'user'},
  {command: 'delete', group: 'admin'}, 
  {command: 'edit', group: 'admin'},
])


/**
 * 
 * @param {Interaction} interaction 
 */

async function GlobalExecute(message, interaction) {
  // message.reply({ content: "Must be Error" })
  return {
    interaction: "Hello World From Parent To Interaction",
    message: "Hello World From Parent To Message"
  }
};