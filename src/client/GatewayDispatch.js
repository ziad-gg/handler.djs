const { Client, Collection } = require('discord.js');
const Base = require('../structures/Base.js');
const { WebSocketManager, WebSocketShardEvents } = require('@discordjs/ws');
const { REST } = require('@discordjs/rest');


class GatewayDispatch extends Base {
  constructor(payload, client, version) {
    super();
    this._patch(this, 'version', version)
    this._patch(this, 'client', client);
    this._patch(this, 'payload', payload);
    this._patch(this, 'REST', new REST({ version: this.version }).setToken(this.client.token));
    this._patch(this, 'gatway', { ...this.payload, rest: this.REST })
    this._patch(this, 'ws', new WebSocketManager(this.gatway));
    this.EventsEmiter = new Collection()
  }

  async connect() {
    this.ws.connect()
    this.ws.on(WebSocketShardEvents.Dispatch, (...args) => this.gateway(...args));
    
  };

  on(event, callback) {
    if (this.ws === void 0) throw new Error("You need to login first")
    this.EventsEmiter.set(event, {
      callback,
      on: true,
      once: false,
    });
  };

  gateway(event) {
    const { t, d } = event.data;
    const e = this.EventsEmiter.get(t)
    this.client.api.emit(t, d);
    if (!e) return
    if (e.on) e.callback(d);
    if (event === 'READY') this.EventsEmiter.delete(event) 
  };

  onEvent(event, callback) {
    this.ws.on(event, callback);
    return this;
  };

};

module.exports = GatewayDispatch;