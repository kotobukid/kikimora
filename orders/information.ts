import Discord, {AnyChannel, Message} from 'discord.js';
import {KikimoraClient, OrderSet} from "../types";
import {category} from "../config";
import {get_payload} from "../functions";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }): void => {
    const message_text: string = msg.content.trim();
    const parsed: OrderSet = get_payload(message_text);

    client.channels.fetch(category.recruit).then((recruit_category: AnyChannel | null): void => {
        console.log(msg)
        // @ts-ignore
        const everyoneRole: Discord.Role | undefined = msg.guild.roles.cache.get(msg.guild.id);
        console.log(everyoneRole);
    });
}

export default func;