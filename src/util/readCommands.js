const readPath = require('./readPath.js');
const path = require('node:path');
const Command = require('../structures/CommandBuilder.js');
const CommandBuilder = require('../managers/CommandBuilder.js');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');
const getFileCategory = require('./getFileCategory.js');

module.exports = async function (pathManeger, main) {
  
  const commands = new Array() || [];
  const files = await readPath(pathManeger);

  for await (const file of files) {

    const cmd = require(path.join(file));

    if (!(cmd instanceof Command)) throw new Error(`Invalid command type in constructor: ${file}`);
    if (!cmd.name) throw new Error(`Command name is missing in: ${file}`);
    if (!cmd.global && !cmd.run && !cmd.interaction) throw new Error(`Command execution is missing in: ${file}`);
    if (cmd.disabled) continue; 

    cmd.category = !cmd.category ? getFileCategory(file) : cmd.category;
    const cmdBuilder = await new CommandBuilder(cmd, main).new();

    if (commands.find(e => e.name.toLowerCase() === cmd.name.toLowerCase() && !cmd.disabed && !cmd.isSub)) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `${file}`, "repeated command", true)
    commands.push(cmdBuilder);
    
  };

  return commands
}