const Application = require('../structures/Application.js');
const MessageBuilder = require('../managers/MessageBuilder.js');

/**
 * 
 * @param {Application} App 
 * @param {MessageBuilder} message
 */

module.exports = async function(App, Command, message, next) {
 
 const end = () => {
  message.stop()
  return 1
 };

 if (!App.valids || App.valids.length === 0) {
   return next()
 };

 for await (const valid of App.valids) 
   if (valid.commands.includes(Command.name.toLowerCase()) || valid.commands.includes("all") || valid.commands === "all") {
     const v = await valid.execution(message, next, end);
     if (v === 1) return;
   };
}