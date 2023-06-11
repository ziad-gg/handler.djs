const { SlashCommandBuilder } = require("discord.js");
const { CommandBuilder, Interaction } = require("../../../src");

module.exports = new CommandBuilder()
.setName('me')
.setDescription('bla command')
.InteractionOn(new SlashCommandBuilder())
.setInteractionExecution(Execute)
.setMessageExecution(MessageEx)
.isSubCommand();

/**
 * 
 * @param {Interaction} interaction 
 */

async function MessageEx(message) {
    console.log(message[0])
    await message.followUp({ content: "Hello From Child With Type 1" })
}

async function Execute(interaction) {
    await interaction.followUp({ content: "Hello From Child With Type 1" })
}