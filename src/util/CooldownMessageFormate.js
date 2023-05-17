const MessageBuilder = require('../managers/MessageBuilder.js');

/**
 * @param {String} content 
 * @param {MessageBuilder} message 
 * @param {String} counter 
 */

module.exports = async (content, message, counter) => {
    const AuthorId = message.author.id;
    const AuthorMention = message.author;
    const AuthorTag = message.author.tag;
    const AuthorUsername = message.author.username;
    const Counter = counter.replace(/\-/g, '');

    const REG_AuthorId = /\{UserId}/g;
    const REG_AuthorMention = /\{UserMention}/g;
    const REG_AuthorTag = /\{UserTag}/g;
    const REG_AuthorUsername = /\{Username}/g;
    const REG_Counter = /\{counter}/g;
    const REG_Timer = /\{timer}/g;
    const REG_Time = /(\d+)\sms\b/;

    const timer = parseInt(Counter);
  
    content = content.replace(REG_AuthorId, AuthorId);
    content = content.replace(REG_AuthorMention, AuthorMention);
    content = content.replace(REG_AuthorTag, AuthorTag);
    content = content.replace(REG_AuthorUsername, AuthorUsername);
    content = content.replace(REG_Counter, Counter);
    content = content.replace(REG_Timer, timer);
    content = content.replace(REG_Time, (match, time) => `${Math.floor(parseInt(time)/1000)}s`);
  
    return content;
};
