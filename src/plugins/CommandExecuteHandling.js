const MessageBuilder = require('../managers/MessageBuilder.js');

/**
 * 
 * @param {MessageBuilder} message 
 * @returns 
 */

module.exports = async function (message, Command) {
  return (key, value) => { (key && value )? message.meta[key] = value : null };  
}