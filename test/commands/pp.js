const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../src");

module.exports = new CommandBuilder()
.setName('pp')
.setDescription('Bot Response Ws')
.InteractionOn(new SlashCommandBuilder().addUserOption(op => op.setName('u').setDescription('d')))
.setInteractionExecution(Execute);

/**
 * 
 * @param {Interaction} interaction 
 */

function Execute (interaction) {
//  console.log(interaction)
//  console.log(interaction['description'])
}