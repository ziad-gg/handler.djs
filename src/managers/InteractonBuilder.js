const { CommandInteraction, Client, Options } = require('discord.js');
const Application = require('../structures/Application.js');
const extractInteractionOptions = require('../util/extractArguments.js')


class InteractionBuilder extends CommandInteraction {
    constructor(client, ApiInteraction, Application) {
        super(client, ApiInteraction)

        this.ApiRes = ApiInteraction
        /** @type {Application} */
        this.Application = Application;
        this.Api = ApiInteraction;
        this.prefix = this.Application.prefix;
        this.data = Application.data;
        this.stoped = false;
    };


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
    };



    run() {

        this.author = this.user;

        this.cmdName = this.commandName;
        this.isCmd = this.Application.getCommand(this.cmdName) ? true : false;
        this.author.isOwner = this.Application.owners.includes(this.author.id);
        this.Command = this.Application.getCommand(this.cmdName);

        this.replyNoMention = this.reply;

        return this;
    };

    args() {
        const InteractionOptions = extractInteractionOptions(this.ApiRes.data.options);

        const ApiResOptions = this.ApiRes.data?.options?.[0];

        if (ApiResOptions && ApiResOptions.type === 2) {
            const GroupChildName = ApiResOptions.options[0].name;
            this.GroupName = ApiResOptions.name;
            this.GroupChildName = GroupChildName;
            this.ResponseType = ApiResOptions.type;
        } else if (ApiResOptions && ApiResOptions.type === 1) {
            this.GroupName = ApiResOptions.name;
            this.ResponseType = ApiResOptions.type;
        }

        for (let i = 0; i < InteractionOptions.length; i++) {
            const option = InteractionOptions[i]
            this[i] = option.value;
            this[option.name] = option.value;
        }
    };

    async getUser(id) {
        const regex = /^[0-9]{16,20}$/;
        let User = await this.client.users.cache.get(id);
        if (!User) User = await this.guild.members.cache.get(id);
        if (!User) User = await this.client.users.fetch(id).then(user => user).catch(e => null);
        if (!User) User = await this.guild.members.fetch(id).then(user => user).catch(e => null);
        return User;
    };

    isStoped() {
        return this.stoped
    };

    stop() {
        this.stoped = true;
        return this
    };

    getData(key) {
        return this.Application.data.get(key);
    };

    getAttr(key) {
        return this.Command.getAttr(key);
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


module.exports = InteractionBuilder