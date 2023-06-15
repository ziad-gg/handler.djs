const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder } = require("../../../src");
const ping = require('../user');

module.exports = new CommandBuilder()
.setName('delete')
.setDescription('delete a User in the database')
.InteractionOn(new SlashCommandBuilder())
.setGlobal(Global)
.setMessageExecution(Message)
.setInteractionExecution(Interaction)
.isSubCommand();

async function Global (message, interaction, global) {

  console.log(global)

  const controller = message ?? interaction

  await controller.reply({ content: "Hello World From Global Global Response" })

  return {
    interaction: true,
    message: "man"
  }
}

function Message (message, global) {
  console.log(global)
  message.reply({ content: "Hello World From Child Message Response" })
}

async function Interaction (interaction, global) {
  console.log(global)
  interaction.followUp({ content: "Hello World From Child Interaction Response" })
}