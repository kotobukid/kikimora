import Discord, {AnyChannel, Message} from 'discord.js';
import {KikimoraClient, OrderSet} from "../types";
import {category} from "../config_loader";
import {get_orders} from "../functions";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }): void => {
    // const {order, payload}: OrderSet = get_orders(msg);

    client.channels.fetch(category.recruit).then((recruit_category: AnyChannel | null): void => {
        console.log(msg)
        // @ts-ignore
        const everyoneRole: Discord.Role | undefined = msg.guild.roles.cache.get(msg.guild.id);
        console.log(everyoneRole);
    });
}

export default func;