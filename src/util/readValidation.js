const readPath = require('./readPath.js');
const path = require('node:path');
const Validation = require('../structures/validation.js');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');

module.exports = async function(pathManeger, Application) {
  const files = await readPath(pathManeger);

  for await (const file of files) {
    const validation = require(file);
    if (!validation || !(validation instanceof Validation)) throw new DiscordjsTypeError(ErrorCodes.InvalidType, "validation", "not Validation Constractor", true);
    if (!validation.commands?.valid) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `commands`, `missing Argument`, true);
    if (!validation.commands.run) throw new DiscordjsTypeError(ErrorCodes.InvalidType, `execution function`, `missing Argument`, true);

    const data = {
        commands: validation.commands.valid.includes('all')? ["all"] : validation.commands.valid,
        execution: validation.commands.run
    }

    Application.valids.push(data);  
  }
}