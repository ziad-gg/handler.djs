const { SlashCommandBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require('handler.djs');

module.exports = new CommandBuilder()
.setName('Set')
.setDescription('set command')
.InteractionOn(new SlashCommandBuilder())
.setCooldown("5s")
.setGlobal(GlobalExecute)
.isSensitive()
.setSubcommands([ {command: 'delete', commandGroup: 'user'} ])


/**
 * 
 * @param {Interaction} interaction 
 */

async function GlobalExecute(message, interaction) {
  return {
    interaction: "Hello World From Parent",
    message: "Hello World Too"
  }
};