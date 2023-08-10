import Discord from "discord.js";

export type KikimoraClient = Discord.Client & { channels: { cache: Record<string, any> } }

export type ParsedMessage = { m: string, d: string, message_payload: string }

export type OrderSet = {
    order: string,
    payload: string
}