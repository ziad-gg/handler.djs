const fs = require('node:fs');
const { EventEmitter } = require('node:events');
const ms = require('ms');

const { Collection, Events, GatewayDispatchEvents } = require('discord.js');
const axios = require('axios');
const { DiscordjsTypeError, ErrorCodes } = require('discord.js/src/errors');

const payload = require('../client/payload.js');
const GatewayDispatch = require('../client/GatewayDispatch.js');
const API = require('../client/api.js');

const Base = require('./Base.js');

const readCommands = require('../util/readCommands.js');
const readEvents = require('../util/readEvents.js');
const readValidation = require('../util/readValidation.js');
const Register_Commands = require('../util/Register_Commands.js');

const MessagePlugin = require('../plugins/MessageHandling.js');
const InteractionPlugin = require('../plugins/InteractionHandling.js');


class Application extends Base {

  constructor(client, { commandsPath, EventsPath, validationPath, owners = [], prefix } = {}) {
    super();
    const main = this;
    this.prefix = prefix ? prefix : "?"
    this.main = main;
    this._patch(main, "client", client);
    this._patch(main, "commandsPath", commandsPath);
    this._patch(main, "EventsPath", EventsPath);
    this._patch(main, "validationPath", validationPath);
    this._patch(main, "paths", new Object());
    this._patch(this.main, "valids", []);
    this._patch(main, "data", new Collection());
    this._patch(main, "_command$", new Collection());
    this._patch(this.main, "cooldownConfig", {
      message: "**{Username}**, Cool down (**{counter}** left)",
      reference: true,
      long: true,
      Mdelete: null,
      EphemeralReply: true,
      once: false
    }, true);
    this.commands = this["_command$"];
    this.owners = owners;
    client.Application = this;
    client.api = new EventEmitter();
    if (!Array.isArray(this.owners)) throw new DiscordjsTypeError(ErrorCodes.InvalidType, "owners", "array only", true);
  }

  async setPrefix(prefix = "?") {
    if (typeof prefix !== "string") this.prefix = "?"
    else this.prefix = prefix;
    return this
  };

  async setCooldown({
    message = "**{Username}**, Cool down (**{counter}** left)",
    reference = true,
    long = true,
    Mdelete = null,
    EphemeralReply = true,
    once = false
  }) {

    if (typeof message !== "string") throw new Error("Content must be an String only");
    if (typeof reference !== "boolean") throw new Error("reference must be an Boolean only");
    if (typeof long !== "boolean") throw new Error("long must be an Boolean only");
    if (typeof once !== "boolean") throw new Error("once option must be an Boolean only");
    if (typeof EphemeralReply !== "boolean") throw new Error("EphemeralReply must be an Boolean only");

    let timer = null
    if (Mdelete && typeof Mdelete === "string") timer = ms(Mdelete) ?? 5000;
    if (Mdelete && typeof Mdelete === "number") timer = Mdelete

    this.cooldownConfig.message = message;
    this.cooldownConfig.long = long;
    this.cooldownConfig.reference = reference;
    this.cooldownConfig.Mdelete = Mdelete;
    this.cooldownConfig.EphemeralReply = EphemeralReply;
    this.cooldownConfig.once = once;

    return this;
  };

  setCooldownMessage(message) {
    if (!message || typeof message !== "string") throw new Error("Content must be an String only");
    this.cooldownConfig.message = message;
    return this;
  }

  async build() {
    this.client.once(Events.ClientReady, async (c) => {

      this.wsPay = payload(c);
      const Gateway = new GatewayDispatch(this.wsPay, this.client, '10');
      this.ws = Gateway;
      this.REST_API = new API(this.wsPay, c, '10');
      await Gateway.connect();


      Gateway.on(GatewayDispatchEvents.Ready, () => c.emit("clientReady", c));

      await this._build();
      const commands = await readCommands(this.paths.commandsPath, this.main);
      commands.forEach(cmd => this["_command$"].set(cmd.name.toLowerCase(), cmd));
      this.interactions = await Register_Commands(this, commands.filter(cmd => cmd.int).map(e => e.builder));

      this.#plugins();
    });
    return this;
  };

  setData(data = {}) {
    if (typeof data !== "object") throw new DiscordjsTypeError(ErrorCodes.InvalidType, "data", "Object");
    Object.keys(data).forEach(key => {
      this.data.set(key, data[key]);
    })
  };

  getData(key) {
    return this.data.get(key)
  };

  getCommand(name) {
    return this["_command$"].get(name);
  };

  async _build() {
    if (!this.client) throw new DiscordjsTypeError(ErrorCodes.InvalidType, "Client", "parameters", true);
    if (!this.commandsPath) throw new DiscordjsTypeError(ErrorCodes.InvalidType, "commandsPath", "parameters", true);

    await fs.readdirSync(this.commandsPath);

    if (this.EventsPath) await fs.readdirSync(this.EventsPath);
    if (this.EventsPath) await readEvents(this.EventsPath, this.main, this.client);
    if (this.validationPath) await fs.readdirSync(this.validationPath);
    if (this.validationPath) await readValidation(this.validationPath, this.main);

    this.paths.commandsPath = this.commandsPath;
    this.paths.EventsPath = this.EventsPath;

    this._patch(this, "api", axios.create({ headers: { 'Authorization': `Bot ${this.client.token}` } }));
  };

  async #plugins() {
    MessagePlugin(this.client, this.main);
    InteractionPlugin(this.client, this.main);
  };


}

module.exports = Application;