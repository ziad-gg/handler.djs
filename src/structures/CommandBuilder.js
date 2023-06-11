const Base = require('./Base.js');
const { PermissionsBitField, Collection, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js');
const ms = require('ms');

class Command extends Base {
  constructor() {
    super();
    this.int = false;
    this._patch(this, "attr", new Collection());
    this._patch(this, "Subs", []);
  };

  setName(name) {
    if (typeof name !== "string") throw new Error(`Command name must be a string. Received: ${typeof name}`);
    this._patch(this, "name", name);
    return this;
  };

  setDescription(description) {
    if (typeof description !== "string") throw new Error(`Command description must be a string. Received: ${typeof description}`);
    this._patch(this, "description", description);
    return this;
  };

  setUsage(usage) {
    if (!Array.isArray(usage) && typeof usage !== "string") throw new Error(`Command usage must be a string or an array. Received: ${typeof usage}`);
    if (Array.isArray(usage)) usage.forEach(element => {
      if (typeof element !== "string") throw new Error(`Element in command usage array must be a string. Received: ${typeof element}`);
    });
    this._patch(this, "usage", usage);
    return this;
  };

  setExample(examples) {
    if (!Array.isArray(examples) && typeof examples !== "string") throw new Error(`Command examples must be a string or an array. Received: ${typeof examples}`);
    if (Array.isArray(examples)) examples.forEach(element => {
      if (typeof element !== "string") throw new Error(`Element in command examples array must be a string. Received: ${typeof element}`);
    });
    this._patch(this, "examples", examples);
    return this;
  };

  setCooldown(cooldown) {
    if (typeof cooldown === "string") {
      cooldown = ms(cooldown);
      if (typeof cooldown !== "number") throw new Error(`Command cooldown must be a number or a valid string. Received: ${typeof cooldown}`);
    } else if (typeof cooldown !== "number") {
      throw new Error(`Command cooldown must be a number or a valid string. Received: ${typeof cooldown}`);
    }
    this._patch(this, "cooldown", cooldown);
    return this;
  };

  OwnersOnly() {
    this._patch(this, "owners", true);
    return this;
  };

  isSensitive() {
    this._patch(this, 'sensitive', true);
    return this;
  };
  
  setDisabled(disabled) {
    if (typeof disabled !== "boolean") throw new Error(`Command disabled must be a boolean. Received: ${typeof disabled}`);
    this._patch(this, "disabled", disabled);
    return this;
  };

  setPermissions(permissions) {
    if (!permissions) throw new Error(`Command permissions must be a valid permission or an array of valid permissions.`);
    if (!Array.isArray(permissions)) permissions = [permissions];
    const validPermissions = Object.keys(PermissionsBitField.Flags);
    permissions.forEach(permission => {
      if (!validPermissions.includes(permission)) throw new Error(`Command permissions must be a valid permission or an array of valid permissions (${validPermissions.join(", ")}). Received: ${permission}`);
    });
    this._patch(this, "permissions", permissions);
    return this;
  };

  setCategory(name = "auto") {
    const category = typeof name !== "string" ? "auto" : name;
    this._patch(this, "category", category);
    return this;
  };

  setAttr(key, value) {
    this.attr.set(key, value);
    return this;
  };

  #getAttr(key) {
    return this.attr.get(key)
  };

  /**
   * 
   * @param {SlashCommandBuilder} SlashCommandstructure 
   * @returns 
   */

  InteractionOn(SlashCommandstructure) {
    if (!SlashCommandstructure || !SlashCommandstructure?.toJSON) throw new Error('SlashCommandstructure must be a SlashCommandBuilder class');
    if (!this.name || !this.description) throw new Error('You must set the command name and description first');
    SlashCommandstructure.setName(this.name.toLowerCase()).setDescription(this.description);
    this._patch(this, 'builder', SlashCommandstructure);
    this.int = true;
    return this;
  };

  isSubCommand() {
    if (this.global) throw new Error('Command which is a sub command cannot have a global execution in it');
    this._patch(this, 'isSub', true);
    return this;
  };

  mergeCommands(...subcommands) {

    let _do = false
    const Group = new SlashCommandSubcommandGroupBuilder();

    if (!this.int) {
      throw new Error("Subcommands can only be merged for slash commands. Please use InteractionOn() to enable slash command mode.");
    }

    if (!this.builder) {
      throw new Error("SlashCommandBuilder is not defined. Please set the interaction using InteractionOn() before merging subcommands.");
    }

    subcommands.forEach((subcommand) => {

      if (!subcommand.builder) {
        throw new Error("Invalid subcommand. Subcommands must be instances of the Command class.");
      }

      if (!subcommand.int) {
        throw new Error("Subcommands can only be merged for slash commands. Please enable slash command mode using InteractionOn() for all subcommands.");
      }

      const SubGroup = Object.assign(new SlashCommandSubcommandBuilder(), subcommand.builder);

      if (subcommand.Application.GroupName) {
        Group.setDescription(this.description || subcommand.description);
        Group.setName(subcommand.Application.GroupName);
        Group.addSubcommand(SubGroup);
        _do = true
      } else {
        this.builder.addSubcommand(SubGroup);
      };

    });

    if (_do) this.builder.addSubcommandGroup(Group)
    _do = false
    return this;
  };


  setSubGroupName(name) {
    if (!name || typeof name !== 'string') throw new Error('Subcmmand group Name must be a string');
    this['GroupName'] = name
    return this;
  };

  setSubcommands(options) {

    if (!Array.isArray(options)) {
      throw new Error('Only Array can be pass in setSubcommands() argument.');
    }

    options.forEach((set) => {

      if (!set.command) {
        throw new Error('Each set must have command Builer or commmand Name.');
      }
     
      if (typeof set.command !== 'string' && !(set.command instanceof Command)) {
        throw new Error('Set must have command Name or command Builer.');
      }

      if (set.group && typeof set.group !== 'string') {
        throw new Error('Sub command group name must be a string only');
      }

      if (typeof set.command === 'string') {

         this.Subs.push({
           commandName: set.command,
           commandGroup: set.group,
           commandDescription: set.description,
           sensitive: set.sensitive
         });

      } else if (set.command instanceof Command) {
        this.Subs.push({
          commandName: set.command.name,
          commandGroup: set.group,
          commandDescription: set.description,
          sensitive: set.sensitive
        });
      } else {
        throw new Error('Set must have command Name or command Builer')
      }

    });

    return this;
  };

  #setAsSubcommandOf(mainCommand) {
    if (!mainCommand || !(mainCommand instanceof Command) || !mainCommand.name) throw new Error("Invalid main command. The main command must be an instance of the CommandBuiler class.");
    this._patch(this, "isSubcommandOf", mainCommand.name.toLocaleLowerCase());
    return this;
  };

  setGlobal(executionFunction) {
    if (this.isSub) throw new Error('Command which is a sub command cannot have a global execution in it');
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
