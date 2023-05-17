const Base = require('./Base');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');

class Validation extends Base {

    constructor() {
      super();
      this._patch(this, "commands", new Object());
    }

    setCommnads(commands = "all") {
      this.commands.valid = new Array();
      if (Array.isArray(commands)) {
        commands.forEach(el => {
            if (typeof el !== "string") throw new DiscordjsTypeError(ErrorCodes.InvalidType, "command type", "not a String");
            this.commands.valid.push(el.toLowerCase());
        });
      } else if (typeof commands === "string") this.commands.valid.push(commands.toLowerCase());
      else this.commands.valid.push("all")
      
      return this;
    }

    setExecution(executionFunction) {
        if (typeof executionFunction !== "function") {
          throw new DiscordjsTypeError(ErrorCodes.InvalidType, "execution function", "function", true);
        }
        this.commands.run = executionFunction
        return this;
    };
    

}

module.exports = Validation