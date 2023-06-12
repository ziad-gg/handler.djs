const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../src");

module.exports = new CommandBuilder()
.setName('Main')
.setDescription('Hello World')
.setCooldown(10_000)
.isSensitive()
.InteractionOn(new SlashCommandBuilder())
.setInteractionExecution(Execute)
.setMessageExecution(Execute)

/**
 * 
 * @param {Interaction} interaction 
 */

function Execute (interaction) {
 interaction.reply({ content: "Hello World" })
}