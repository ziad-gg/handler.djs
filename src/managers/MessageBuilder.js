const { Message, REST } = require('discord.js');
const Application = require('../structures/Application.js');
const Api = require('../util/DiscordApi.js');



class MessageBuilder extends Message {
  constructor(client, ApiMessage, Application) {
    super(client, ApiMessage);

    /** @type {Application} */
    this.Application = Application;

    this.prefix = this.Application.prefix;
    this.data = Application.data;

    this.stoped = false;
    this.meta = new Object();

    this.api = this.Application.REST_API;
    /** @type {REST} */
    this.REST = this.api.REST;
 

    this.channelId = ApiMessage.channel_id;

    // const channel = this.client.channels.cache.get(this.channelId);

    // channel.send({ content: "Hello World" })
    // console.log(channel.type === ChannelType.DM);

    // console.log(this.client.channels.cache)
    // console.log()
    // ChannelType.DM
    // this.client.options.get
    // console.log(ApiMessage.channel_id)
    // this.channelManager = new ChannelManager(this.client);
    // this.channelManager.cache.set(this.channelId, 'message');

  
    // console.log(this.channelManager.cache)
  }



  #args() {
    const args = (this.content.slice(this.prefix.length).split(/ +/g));
    this.OrginCmdName = args[0];
    const cmdName = args.shift().toLowerCase();
    for (const i in args) this[i] = args[i];
    return cmdName
  }

  async getUser(id) {
    const regex = /^[0-9]{16,20}$/;
    let User = await this.client.users.cache.get(id);
    if (!User) User = await this.guild.members.cache.get(id);
    if (!User) User = await this.client.users.fetch(id).then(user => user).catch(e => null);
    if (!User) User = await this.guild.members.fetch(id).then(user => user).catch(e => null);
    return User;
  }

  sendTimedMessage(option, time, reference) {
    return new Promise((res, rej) => {
      if (reference) {
        this.reply(option).then(m => {
          res(m)
          setTimeout(() => m.delete(), time)
        })
      } else {
        this.channel.send(option).then(m => {
          res(m)
          setTimeout(() => m.delete(), time)
        })
      }
    })

  }

  run() {
    this.startsWithPrefix = this.content.includes(this.prefix);
    this.cmdName = this.#args();
    this.isCmd = this.Application.getCommand(this.cmdName) ? true : false;
    this.author.isOwner = this.Application.owners.includes(this.author.id);
    /** @type {import('handler.djs/src/@types/types.js').CommandStructur} */
    this.Command = this.Application.getCommand(this.cmdName);
    this.replid = null;
    return this
  }

  async isStoped() {
    return this.stoped
  }

  stop() {
    this.stoped = true;
    return this
  };

  getData(key) {
    return this.Application.data.get(key);
  }

  getAttr(key) {
    return this.Command.getAttr(key);
  }

  reply(options) {
    return new Promise((resolve, reject) => {
      const Routes = this.api.Routes;

      options.message_reference = {
        message_id: this.id,
        guild_id: this?.guild?.id,
        channel_id: this.channel.id,
        fail_if_not_exists: true
      };

      this.REST.post(Routes.channelMessages(this.channel.id), { body: options }).then(data => {
        this.replid = {
          message_id: data.id,
          guild_id: this?.guild?.id,
          channel_id: this.channel.id,
          fail_if_not_exists: true,
        };
        resolve(new MessageBuilder(this.client, data, this.Application));
      });

    });
  };

  replyNoMention(options) {
    return new Promise((resolve, reject) => {

      const Routes = this.api.Routes;

      options.message_reference = {
        message_id: this.id,
        guild_id: this.guild?.id,
        channel_id: this.channel.id,
        fail_if_not_exists: true
      };

      options.allowed_mentions = {
        replied_user: false
      };

      this.REST.post(Routes.channelMessages(this.channel.id), { body: options }).then(data => {
        this.replid = {
          message_id: data.id,
          guild_id: this.guild?.id,
          channel_id: this.channel.id,
          fail_if_not_exists: true,
        };
        resolve(new MessageBuilder(this.client, data, this.Application));
      });

    });
  };

  followUp(options) {
    return new Promise((resolve, reject) => {
      const Routes = this.api.Routes;
      if (!this.replid?.message_id) throw new Error("The reply to this message has not been sent");
      options.message_reference = this.replid;
      this.REST.post(Routes.channelMessages(this.channel.id), { body: options }).then(data => {
        resolve(new MessageBuilder(this.client, data, this.Application));
      }).catch(e => {
        reject(e)
      });
    })
  };

  edit(options) {
    return new Promise((resolve, reject) => {
      const Routes = this.api.Routes;
      options['Content-Type'] = 'application/json';
      this.REST.patch(Routes.channelMessage(this.channel.id, this.id), { body: options }).then(data => resolve(new MessageBuilder(this.client, data, this.Application)));
    })
  }


  slice(start, end) {
    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new TypeError('Start and end arguments must be numbers');
    }
    if (start < 0 || end < 0) {
      throw new RangeError('Start and end arguments must be positive numbers');
    }
    if (start > end) {
      throw new RangeError('Start argument cannot be greater than end argument');
    }

    const args = [];
    for (let i = start; i <= end; i++) {
      if (typeof this[i] !== 'undefined') {
        args.push(this[i]);
      }
    }
    return args;
  };

};

MessageBuilder.prototype.deferReply = async function () { };
MessageBuilder.prototype.editReply = async function () { };
MessageBuilder.prototype.isMessageComponent = async function () { };
MessageBuilder.prototype.isMessageContextMenuCommand = async function () { };
MessageBuilder.prototype.isModalSubmit = async function () { };
MessageBuilder.prototype.isRepliable = async function () { };
MessageBuilder.prototype.isRoleSelectMenu = async function () { };
MessageBuilder.prototype.isSelectMenu = async function () { };
MessageBuilder.prototype.isStringSelectMenu = async function () { };
MessageBuilder.prototype.isUserContextMenuCommand = async function () { };
MessageBuilder.prototype.isUserSelectMenu = async function () { };
MessageBuilder.prototype.isUserSelectMenu = async function () { };
MessageBuilder.prototype.isButton = async function () { };
MessageBuilder.prototype.inCachedGuild = async function () { };
MessageBuilder.prototype.inGuild = async function () { };
MessageBuilder.prototype.inRawGuild = async function () { };
MessageBuilder.prototype.isAnySelectMenu = async function () { };
MessageBuilder.prototype.isAutocomplete = async function () { };
MessageBuilder.prototype.isChannelSelectMenu = async function () { };

module.exports = MessageBuilder;