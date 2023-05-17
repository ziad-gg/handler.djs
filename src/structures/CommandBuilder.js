const Base = require('./Base.js');
const ms = require('ms');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');
const { PermissionsBitField, Collection, SlashCommandBuilder } = require('discord.js');
const Application = require('./Application.js');
const Option = require('./Option.js');

class Command extends Base {
  constructor() {
    super();
    this.int = false;
    this._patch(this, "attr", new Collection());
  }

  setName(name) {
    if (typeof name !== "string") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command name", "string", true);
    }
    this._patch(this, "name", name);
    return this;
  };

  setDescription(description) {
    if (typeof description !== "string") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command description", "string", true);
    }
    this._patch(this, "description", description);
    return this;
  };

  setUsage(usage) {
    if (!Array.isArray(usage) && typeof usage !== "string") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command usage", "string or array", true);
    }

    if (Array.isArray(usage)) {
      usage.forEach((element) => {
        if (typeof element !== "string") {
          throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Element in command usage array", "string", true);
        }
      });
    }

    this._patch(this, "usage", usage);
    return this;
  };

  setExample(examples) {
    if (!Array.isArray(examples) && typeof examples !== "string") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command examples", "string or array", true);
    }

    if (Array.isArray(examples)) {
      examples.forEach((element) => {
        if (typeof element !== "string") {
          throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Element in command examples array", "string", true);
        }
      });
    }

    this._patch(this, "examples", examples);
    return this;
  };

  setCooldown(cooldown) {
    if (typeof cooldown === "string") {
      cooldown = ms(cooldown);
      if (typeof cooldown !== "number") {
        throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command cooldown", "number or valid string", true);
      }
    } else if (typeof cooldown !== "number") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command cooldown", "number or valid string", true);
    };
    this._patch(this, "cooldown", cooldown)
    return this;
  };

  setOwners(owners) {
    if (typeof owners !== "boolean") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command owners", "boolean", true);
    }
    this._patch(this, "owners", owners);
    return this;
  };
  
  setDisabled(disabed) {
    if (typeof disabed !== "boolean") {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Command disabed", "boolean", true);
    }
    this._patch(this, "disabed", disabed);
    return this;
  };
  
  setPermissions(permissions) {
    if (!permissions) throw new DiscordjsTypeError(ErrorCodes.InvalidType,  "command permissions", "a valid permission or array of valid permissions", true);
    if (!Array.isArray(permissions)) permissions = [permissions];
    const validPermissions = Object.keys(PermissionsBitField.Flags);

    permissions.forEach((permission) => {
      if (!validPermissions.includes(permission)) throw new DiscordjsTypeError(ErrorCodes.InvalidType, "command permissions", `A valid permission or array of valid permissions (${validPermissions.join(", ")})`, true); 
    });
    
    this._patch(this, "permissions", permissions);
    return this;
  };

  setCategory(name = "auto") {
    const category = typeof name !== "string"? "auto" : name;
    this._patch(this, "category", category);
    return this;
  };

  setAttr(key, value) {
   this.attr.set(key, value);
   return this;
  }
  
  #getAttr(key) {
    return this.attr.get(key)
  }

  /**
   * 
   * @param {SlashCommandBuilder} SlashCommandstructure 
   * @returns {this}
   */

  InteractionOn(SlashCommandstructure) {
    if (!SlashCommandstructure || !SlashCommandstructure?.toJSON) throw new Error('SlashCommandstructure must be SlashCommandBuilder class');
    if (!this.name || !this.description) throw new Error('You must set command name and description first');
    SlashCommandstructure.setName(this.name).setDescription(this.description);
    this._patch(this, 'builder', SlashCommandstructure);
    this.int = true;
    return this;
  }

  declareArgs(Options) {
    this._patch(this, "args", new Array());
    if (!Array.isArray(Options)) throw new TypeError("[Options] can be only recived in array");
    Options.forEach((arg, index) => {
      if (!(arg instanceof Option)) throw new Error("Invalid argument declaration. Argument must be an Option constructor .");
      if (this.args.find(e => e.name === arg.name)) throw new Error("this Option Already add .")
      arg.index = index
      this.args.push(arg);
    });
    
    return this;
  };

  setGlobal(executionFunction) {
    if (!executionFunction || typeof executionFunction !== 'function') throw new Error('Global execution must be required');
    this._patch(this, "global", executionFunction);
    return this;
  };

  setInteractionExecution(executionFunction) {
    if (!executionFunction || typeof executionFunction !== 'function') throw new Error('Interaction execution must be required');
    this._patch(this, "interaction", executionFunction);
    return this;
  };

  setMessageExecution(executionFunction) {
    if (!executionFunction || typeof executionFunction !== 'function') throw new Error('Message execution must be required');
    this._patch(this, "run", executionFunction);
    return this;
  };
  
}

module.exports = Command;