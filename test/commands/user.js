const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../src");

module.exports = new CommandBuilder()
.setName('user')
.setDescription('Hello World')
.InteractionOn(new SlashCommandBuilder())
.setGlobal(Execute)
.setSubcommands([
    { command: 'me' }
])

/**
 * 
 * @param {Interaction} interaction 
 */

async function Execute (message, interaction) {
    const Controller = message ?? interaction;

    await Controller.reply({ content: "Hello From Parent With Type 1" });
    return {
        interaction: true,
        message: true,
    }
}