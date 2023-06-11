const Application = require('../structures/Application.js')
const { Collection } = require('discord.js');
const Base = require('../structures/Base.js');

class CommandBuilder extends Base {

  constructor(data, Application) {
   super()
   this.Application = data;
   /** @type {Application} */
   this.main = Application;
   this._patch(this, "cooldown", new Object())
  };

  async new() {

    // start Required Properties
    this.name = this.Application.name.toLowerCase();
    this.OrginName = this.Application.name;
    this.description = this.Application.description;
    this.run = this.Application.run;
    this.interaction = this.Application.interaction;
    this.builder = this.Application.builder;
    this.global = this.Application.global;
    // End Required Properties
  
    // start Optional Properties
    this.usage = this.Application.usage || [this.name];
    this.examples = this.Application.examples || [this.name];
    this.permissions = this.Application.permissions || ["SendMessages"];
    this.int = this.Application.int;

     // start Cooldown Config
    this.cooldown.status = this.Application.cooldown && this.main.cooldownConfig ? "on" : "off";
    this.cooldown.timer = this.Application.cooldown || 1;
    this.cooldown.cdCollection = new Collection();
    this.cooldown.message = this.main.cooldownConfig?.message || "**{Username}**, Cool down (**{counter}** left)";
    this.cooldown.reference = this.main.cooldownConfig?.reference || true;
    this.cooldown.long = this.main.cooldownConfig?.long || true;
    this.cooldown.Mdelete = this.main.cooldownConfig?.Mdelete; 
     // End Cooldown Config
    
    this.owners = this.Application.owners ? this.main.owners : null;
    this.disabed = this.Application.disabed ?? false;
    this.category = this.Application.category;
    this.isSubcommandOf = this.Application.isSubcommandOf;    
     // start util Properties

    this.getAttr = function(key) {
      return this.Application.attr.get(key);
    };
     // End util Properties


    return this;
  }
  
};

module.exports = CommandBuilder;