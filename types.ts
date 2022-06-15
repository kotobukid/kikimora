import Discord from "discord.js";

export declare type KikimoraClient = Discord.Client & { channels: { cache: Record<string, any> } }

export declare type ParsedMessage = { m: string, d: string, message_payload: string }

