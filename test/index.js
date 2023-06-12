const { Client, GatewayIntentBits } = require('discord.js');
const { Application } = require('../src');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages
    ] 
});

new Application(client, {
  commandsPath: path.join(__dirname, 'commands'),
});

client.Application.setCooldown({
  message: "Cooldown {counter}",
  reference: true,
  Mdelete: "3s",
  EphemeralReply: false,
  once: false,
});

client.Application.build();

client.login(process.env.token);