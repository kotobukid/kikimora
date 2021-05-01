import Discord, {Channel, Message, TextChannel, VoiceChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {token, category} from "../config";
import {get_payload} from "../functions";
import {create_channel} from "../models";
import process from "process";

const func = (client: KikimoraClient, msg: any) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    msg.channel.send("I'll be back").then();
    console.log("I'll be back");

    setTimeout(() => {
        client.destroy();
        process.exit();
    }, 2500);
}

export default func;



