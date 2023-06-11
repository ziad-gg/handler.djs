const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder } = require("../../../src");
const ping = require('../user');

module.exports = new CommandBuilder()
.setName('delete')
.setDescription('delete a User in the database')
.InteractionOn(new SlashCommandBuilder())
.setMessageExecution(Message)
.setInteractionExecution(Execute)
.isSubCommand();

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 */

function Message(message, global) {
  console.log(message[0])
  message.reply({ content: "Hello World From Child" })
}

async function Execute(interaction, global) {
  await interaction.reply({ content: global });
  interaction.followUp({ content: "Hello World From Child" })
}