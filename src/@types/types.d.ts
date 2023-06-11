import { PermissionResolvable, Events, Client, Collection, SlashCommandBuilder, ButtonBuilder, ModalBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder } from 'discord.js'
import { Message, Command, Interaction } from 'handler.djs'

export interface ApplicationInterface {
    readonly prefix: string
    commands: Collection<string, CommandStructur>
    setPrefix(prefix: String): ApplicationInterface
    setCooldown({ message, reference, long, Mdelete, once }: ApplicationCooldownConstructor): ApplicationInterface
    build(): ApplicationInterface
    setData(data: Object): ApplicationInterface
    getCommand(name: String): CommandStructur
    getData(key: string): any
    setCooldownMessage(message: string): ApplicationInterface
}

export interface ApplicationConstructor {
    commandsPath: string,
    EventsPath: string,
    validationPath: string,
    owners: Array<string>,
    prefix?: String 
}

export interface ApplicationCooldownConstructor {
    message?: String, 
    reference: boolean, 
    long: Boolean, 
    Mdelete: string,
    EphemeralReply: Boolean,
    once: boolean
}

export interface CommandInterface {
    setName(name: string): CommandInterface
    setDescription(description: String): CommandInterface
    setUsage(usage: (Array<string> | string)): CommandInterface
    setExample(examples: (Array<string> | string)): CommandInterface
    setInteractionExecution(callback: (interaction: Interaction) => void): CommandInterface
    setMessageExecution(callback: (message: Message) => void): CommandInterface
    setGlobal(callback: (message: Message, interaction: Interaction) => void): CommandInterface
    setCooldown(cooldown: (String | Number)): CommandInterface
    OwnersOnly(): CommandInterface
    isSensitive(): CommandInterface
    isSubCommand(): CommandInterface
    setSubcommands(options: Array<{ command: (string | CommandInterface), commandGroup?: string, description?: string, sensitive?: Boolean }> ): CommandInterface
    setSubGroupName(name: string): CommandInterface
    setDisabled(disabed: Boolean): CommandInterface
    setCategory(name: String): CommandInterface
    setAttr(key: string, value: string): CommandInterface
    InteractionOn(cmd: SlashCommandBuilder): CommandInterface
}

export interface OptionInterface {
    setName(name: string): OptionInterface
    setRequired(): OptionInterface
}

export interface ValidationInterface {
    setCommnads(commands: (Array<string> | string)): ValidationInterface
    setExecution(executionFunction: Function): ValidationInterface
}

export interface CommandStructur {
    name: String,
    description: String,
    usage: String | Array<String>,
    examples: String | Array<String>,
    run: (message: Message) => void,
    cooldown: Boolean,
    owners: Boolean,
    disabed: Boolean,
    permissions: Array<PermissionResolvable>,
    category: String,
    getAttr(key: string): any
    getData(key: string): any
}

export interface EventBuilderInterface {
    setEvent(name: Events): EventBuilderInterface
    setExecution(func: Function): EventBuilderInterface
    once(value: Boolean): EventBuilderInterface
    setType(Type: Array<ButtonBuilder | ModalBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder>): EventBuilderInterface

}
