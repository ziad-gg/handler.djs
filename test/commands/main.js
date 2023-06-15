const { SlashCommandBuilder, Message } = require("discord.js");
const { CommandBuilder } = require("../../src");

module.exports = new CommandBuilder()
.setName('Main')
.setDescription('Hello World')
.setCooldown(10_000)
.setAliases([ 
    { cut: '.m', sensitive: true },
])
// .isSensitive()
.InteractionOn(new SlashCommandBuilder())
.setInteractionExecution(Execute)
.setMessageExecution(Execute)

/**
 * 
 * @param {Message} interaction 
 */

function Execute (interaction) {
    // interaction.reply({ content: "Hello From Word" })
    interaction.commandFromCut? interaction.replyNoMention({ content: "Hello From Word By Cut Request" }) : interaction.replyNoMention({ content: "Hello From Word By Main Request" })
    // interaction.channel.send({ content: "Hello From Word" });
    
//  interaction.channel.send({ content: "Hello World" })
}