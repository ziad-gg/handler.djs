const { Collection } = require('discord.js');
const ms = require('ms');
const MessageBuilder = require('../managers/MessageBuilder.js');
const CooldownMessageFormatter = require('../util/CooldownMessageFormate.js');

/**
 * Handle command cooldown
 * @param {MessageBuilder} message - The message object
 * @param {object} Command - The command object
 */
module.exports = async function handleCommandCooldown(message, Command) {
  const { cooldown } = Command;

  if (cooldown.status === 'oof') return;

  const key = `${message.author.id}-${message.guild.id}`;
  const { timer, reference, long, Mdelete, EphemeralReply } = cooldown;
  const cooldownMessage = message.Application.cooldownConfig?.message;
  const onceReply = message.Application.cooldownConfig.once;

  const send = Mdelete
    ? (option) => message.sendTimedMessage(option, typeof Mdelete === 'string' ? ms(Mdelete) : Mdelete, reference)
    : (option) => (reference ? message.reply(option) : message.channel.send(option));

  const data = cooldown.cdCollection;
  let keyData = data.get(key);

  if (keyData) {
    if (keyData.reply && onceReply) return message.stop();

    const timeDifference = Date.now() - keyData.ms;
    if (timeDifference < 0 || timeDifference > timer) {
      // Cooldown has expired, delete the existing cooldown data
      data.delete(key);
      keyData = null;
    }
  }

  if (keyData) {
    const timerDuration = timer - (Date.now() - keyData.ms);
    const Timer = ms(timerDuration, { long });

    await send({
      content: await CooldownMessageFormatter(cooldownMessage, message, Timer),
      ephemeral: EphemeralReply || true,
    }).then(() => {
      keyData.reply = true;
      data.set(key, keyData);
      message.stop();
    });

    return 0;
  } else {
    if (!Command.main.owners.includes(message.author.id)) {
      data.set(key, { ms: Date.now(), reply: false });
      setTimeout(() => {
        data.delete(key);
        // console.log(`Cooldown data deleted for key: ${key}`);
      }, timer);
    }
  }
};
