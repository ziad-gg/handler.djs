const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../../src");
const ping = require('../user');

module.exports = new CommandBuilder()
.setName('edit')
.setDescription('edit a User in the database')
.InteractionOn(new SlashCommandBuilder().addUserOption(op => op.setName('u').setDescription('d')))
.setInteractionExecution(Execute)
.isSubCommand();


/**
 * 
 * @param {Interaction} interaction 
 */

function Execute(interaction) {
    //  console.log(interaction)
    //  console.log(interaction['description'])
}