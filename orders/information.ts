import Discord, {Message, PermissionOverwrites, TextChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload} from "../functions";
import {create_channel} from "../models";
import _ from 'lodash';

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    client.channels.fetch(category.recruit).then(recruit_category => {
        // @ts-ignore
        console.log(msg)
        // @ts-ignore
        const everyoneRole = msg.guild.roles.cache.get(msg.guild.id);
        console.log(everyoneRole);
    });
}

export default func;