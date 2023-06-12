const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder } = require("../../../src");
const ping = require('../user');

module.exports = new CommandBuilder()
.setName('delete')
.setDescription('delete a User in the database')
.InteractionOn(new SlashCommandBuilder())
// .setGlobal(Global)
.setMessageExecution(Message)
.setInteractionExecution(Interaction)
.isSubCommand();

function Global (message, interaction, global) {

  return {
    interaction: true,
    message: true
  }
}

function Message (message, global) {
  console.log(global)
  message.reply({ content: "Hello World From Child" })
}

async function Interaction (interaction, global) {
  console.log(global)
  interaction.replyNoMention({ content: "Hello World From Child" })
}