const { Collection } = require('discord.js');
const ms = require('ms');
const MessageBuilder = require('../managers/MessageBuilder.js');
const CooldownMessageFormator = require('../util/CooldownMessageFormate.js');

/**
 * 
 * @param {MessageBuilder} message 
 */

module.exports = async function (message, Command) {
 if (Command.cooldown.status === "oof") return;
 const key = `${message.author.id}-${message.guild.id}`;
 const cooldown = Command.cooldown;
 const time = cooldown.timer;
 const cooldownMessage = message.Application.cooldownConfig?.message;
 const onceReply = message.Application.cooldownConfig.once;
 const reference = cooldown.reference;
 const long = cooldown.long;
 const send = cooldown.Mdelete? 
 (option) => message.sendTimedMessage(option, cooldown.Mdelete, reference) : 
 (option) => (reference)? message.reply(option) : message.channel.send(option);

 /** @type {Collection} */
 const data = cooldown.cdCollection;
 const keyData = data.get(key);

 if (keyData) {
  if (keyData.reply && onceReply) return message.stop();
  const Timer = ms(Date.now() - keyData.ms, { long });

  await send({
    content: await CooldownMessageFormator(cooldownMessage, message, Timer), 
    ephemeral: cooldown.EphemeralReply || true
  }).then(() => {
    keyData.reply = true;
    data.set(key, keyData);
    message.stop();
  });

  return 0

 } else {
     if (!Command.main.owners.includes(message.author.id)) {
       data.set(key, { ms: Date.now() + time, reply: false });
       setTimeout(() => data.delete(key), time);
     };
 };
}