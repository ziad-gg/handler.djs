<center>
<img src="https://nodei.co/npm/handler.djs.png?downloads=true&stars=true" alt="v">

# Introduction

handler.djs is a powerful tool designed to simplify the management of Discord.js bot files. It aims to enhance productivity by reducing the amount of time and code required to handle various aspects of a Discord bot, while also improving performance.

# Installing
 ```bash
  $ npm init
  $ npm i discord.js@v14.9.0
  $ npm i handler.djs
 ```

<h6>You can Handel Files with this package</h6>

# SetUp
```js
const { Client, GatewayIntentBits } = require('discord.js');
const { Application } = require('handler.djs');
const path = require('node:path');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages
    ] 
});

new Application(client, {
  commandsPath: path.join(__dirname, 'commands'),
});

client.Application.setPrefix("!");

client.Application.build();

client.login(yourToken);
```


### commands Setup

```js
const { CommandBuilder } = require('handler.djs');

module.exports = new CommandBuilder() 
.setName("ping")
.setDescription("Test Bot ws Ping")
setMessageExecution(Execute)

async function Execute(message) {
  message.reply({ content: "PONG 🏓" });
}
```
</center>