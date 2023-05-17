const readPath = require('./readPath.js');
const path = require('node:path');
const Command = require('../structures/CommandBuilder.js');
const CommandBuilder = require('../managers/CommandBuilder.js');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');

module.exports = async function(pathManeger, main) {
  const commands = new Array() || [];
  const files = await readPath(pathManeger);
  for await (const file of files) {
    
    const cmd = require(path.join(file));

    if (!cmd instanceof Command) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `${file}`, `Command Constractor`, true);
    if (!cmd.name) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `cmd Name`, `missing Argument`, true);
    // if (!cmd.description) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `cmd description`, `missing Argument`, true);
    if (!cmd.run && !cmd.interaction) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `cmd Execution`, `missing Argument`, true);
    if (cmd.disabed) continue;
    const paths = file.toString().split("\\");

    cmd.category = !cmd.category? paths[paths.length - 2] : cmd.category;
    const cmdBuilder = await new CommandBuilder(cmd, main).new();

    if (commands.find(e => e.name.toLowerCase() === cmd.name.toLowerCase()  && !cmd.disabed)) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `${file}`, "repeated command", true) 
    commands.push(cmdBuilder);
    
  }
  return commands
}