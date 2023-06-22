const { Routes } = require('discord-api-types/v10');
const GatewayDispatch = require('./GatewayDispatch');


class Api extends GatewayDispatch {
    constructor (payload, client, v) {
      super(payload, client, v);
      this.Routes = Routes;
    };
}


module.exports = Api