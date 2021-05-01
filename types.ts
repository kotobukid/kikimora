import Discord from "discord.js";

export declare type KikimoraClient = Discord.Client & { channels: { cache: Record<string, any> } }

