const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder } = require("../../../src");
const wait = require('node:timers/promises').setTimeout
const ping = require('../user');

module.exports = new CommandBuilder()
.setName('delete')
.setDescription('delete a User in the database')
.InteractionOn(new SlashCommandBuilder().addNumberOption(op => op.setName('helllo').setDescription("djdjasd asdaadsasds")))
.setGlobal(Global)
.setMessageExecution(Message)
.setInteractionExecution(Interaction)
.isSubCommand();

async function Global (message, interaction, global) {
  const controller = message ?? interaction

  // await controller.({ content: "Hello World From Global Global Response" })

  return {
    interaction: true,
    message: "man"
  }
}

function Message (message, global) {
  console.log(global)
  message.reply({ content: "Hello World From Child Message Response" })
}

async function Interaction (interaction, Global) {
  // await interaction.deferReply()  
  
  interaction.replyNoMention({ content: "Hello World From Child Interaction Response" });
  await wait(2)
  interaction.editReply({ content: "Hello World" })

}