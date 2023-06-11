
import { 
  Client,
  MessageManager as MesssageBuilder,
  CommandInteraction, 
  PermissionResolvable, 
  Collection, 
  User, 
  GuildMember, 
  MessageCreateOptions,
  MessagePayload,
  Events,
  SlashCommandBuilder,
  ButtonBuilder,
  ModalBuilder, 
  StringSelectMenuBuilder,
  UserSelectMenuBuilder
 } from 'discord.js'
import { 
  ApplicationInterface, 
  ApplicationConstructor,
  ApplicationCooldownConstructor,
  CommandInterface,
  OptionInterface, 
  CommandStructur, 
  ValidationInterface, 
  EventBuilderInterface,
 } from './types'


declare module "handler.djs" {


   class Base {
     private _patch(obj: Object, key: string, value: any): void
     private toJSON(): JSON
   }
   
  class Application extends Base {
    constructor(client: Client, { commandsPath, EventsPath, validationPath, owners, prefix }: ApplicationConstructor)
    readonly prefix: String
    commands: Collection<string, Command>
    public setPrefix(prefix: String): ApplicationInterface
    public setCooldown({message, reference, long, Mdelete, EphemeralReply, once }: ApplicationCooldownConstructor): ApplicationInterface
    public build(): ApplicationConstructor
    public setData(data: Object): ApplicationInterface
    public getCommand(name: String): CommandStructur
    private _build(): ApplicationInterface
    public getData(key: string): any
    public setCooldownMessage(message: string): ApplicationInterface
  }

  class CommandBuilder extends Base {
    public setName(name: string): CommandInterface
    public setDescription(description: String): CommandInterface
    public setUsage(usage: (Array<string> | string)): CommandInterface
    public setExample(examples: (Array<string> | string)): CommandInterface
    public setInteractionExecution(callback: (interaction: Interaction) => void): CommandInterface
    public setMessageExecution(callback: (message: Message) => void): CommandInterface
    public setGlobal(callback: (message: Message, interaction: Interaction) => void): CommandInterface
    public setCooldown(cooldown: (String | Number)): CommandInterface
    public OwnersOnly(): CommandInterface
    public isSensitive(): CommandInterface
    public isSubCommand(): CommandInterface
    public setSubcommands(options: Array<{ command: (string | CommandBuilder), commandGroup?: string, description?: string, sensitive?: Boolean }> ): CommandInterface
    public setSubGroupName(name: string): CommandInterface
    private mergeCommands(command: Array<CommandBuilder>): SlashCommandBuilder
    public setDisabled(disabed: Boolean): CommandInterface
    private setPermissions(permissions: Array<PermissionResolvable> | PermissionResolvable): CommandInterface
    public setCategory(name: String): CommandInterface
    public setAttr(key: string, value: string): CommandInterface
    public InteractionOn(cmd: SlashCommandBuilder): CommandInterface
  }

  class Validation extends Base {
    public setCommnads(commands: (Array<string> | string)): ValidationInterface
    public setExecution(executionFunction: Function): ValidationInterface
  }

  class Message extends MesssageBuilder {
    public Application: ApplicationInterface
    public prefix: string
    public data: Collection<string, any>
    public getUser(id: String | number): (User | GuildMember)
    public sendTimedMessage(option: MessagePayload, time: number, reference: Boolean): void
    public replyNoMention(option: MessagePayload): Message
    private run(): any
    public isStoped(): boolean
    public stop(): any
    public startsWithPrefix: boolean
    public cmdName: string
    public isCmd: Boolean
    public Command: Command
    public getAttr(key: string): any
    public getData(key: string): any
    public meta: Object
  }

  class Interaction extends CommandInteraction {
    public Application: ApplicationInterface
    public prefix: string
    public data: Collection<string, any>
    public getUser(id: String | number): (User | GuildMember)
    public sendTimedMessage(option: MessageCreateOptions, time: number, reference: Boolean): void
    private run(): any
    public isStoped(): boolean
    public stop(): any
    public cmdName: string
    public isCmd: Boolean
    public Command: Command
    public getAttr(key: string): any
    public getData(key: string): any
  }

  class Command extends Base {
    public name: string
    public description: string
    private run(): void
    public usage: Array<string>
    public examples: Array<string>
    public permissions: Array<PermissionResolvable>
    public owners: Array<string>
    public disabed: Boolean
    public category: String
    private data: Object
  }

  class EventBuilder extends Base {
   setEvent(name: Events): EventBuilderInterface
   setExecution(func: Function): EventBuilderInterface
   once(value: Boolean): EventBuilderInterface
   setType(Type: Array<ButtonBuilder | ModalBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder>): EventBuilderInterface
  }
  
}

declare module "discord.js" {
  export interface Client {
    Application: ApplicationInterface
  }
  export enum Events {
    ButtonClick = "ButtonClick",
    ModelSummit = "ModelSummit"
  }  
}