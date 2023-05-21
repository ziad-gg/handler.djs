const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../src");

module.exports = new CommandBuilder()
.setName('ping')
.setDescription('Bot Response Ws')
.InteractionOn(new SlashCommandBuilder().addSubcommand(subcommand => subcommand 
 .setName('pong')
 .setDescription('pins ping') 
.addStringOption(opt => opt.setName('name').setDescription('Panal embed Title to Create').setRequired(true).setMaxLength(10))
.addStringOption(opt => opt.setName('description').setDescription('Panal embed Description to Create').setRequired(true))
.addNumberOption(opt => opt.setName('limit').setDescription('Limit Number Of tickets To open for one User'))
.addChannelOption(opt => opt.setName('category').setDescription('Category To Open Tickets In'))
))
.setInteractionExecution(Execute);

/**
 * 
 * @param {Interaction} interaction 
 */

function Execute (interaction) {
 console.log(interaction['name'])
 console.log(interaction['description'])
}