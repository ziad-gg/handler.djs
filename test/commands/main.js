const { SlashCommandBuilder, EmbedBuilder, Message } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../src");

module.exports = new CommandBuilder()
.setName('Main')
.setDescription('Hello World')
.setCooldown(10_000)
// .isSensitive()
.InteractionOn(new SlashCommandBuilder())
.setInteractionExecution(Execute)
.setMessageExecution(Execute)

/**
 * 
 * @param {Message} interaction 
 */

function Execute (interaction) {
    interaction.replyNoMention({ content: "Hello From Word" })
//  interaction.channel.send({ content: "Hello World" })
}