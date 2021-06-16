import Discord, {Message, PermissionOverwrites, TextChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {clone_flat_map, get_payload} from "../functions";
import {create_channel} from "../models";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    // @ts-ignore
    client.channels.fetch(category.recruit, false, true).then((recruit_category: Discord.Channel & { permissionOverwrites: Map<string, PermissionOverwrites> }) => {

        if (!recruit_category) {
            msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        if (parsed.payload.trim() === '') {
            msg.channel.send("募集チャンネルの名前を指定してください。").then();
            return;
        }

        // @ts-ignore
        const everyoneRole = msg.guild.roles.cache.get(msg.guild.id);

        // @ts-ignore
        const permissionOverwrites: Map<string, PermissionOverwrites> = clone_flat_map(recruit_category.permissionOverwrites);

        permissionOverwrites.set(`${msg.author.id}`, {
            id: msg.author.id,
            // @ts-ignore
            allow: ['MANAGE_CHANNELS'],
        });
        permissionOverwrites.set(everyoneRole!.id, {
            id: everyoneRole!.id,
            // @ts-ignore
            deny: ['VIEW_CHANNEL'],
        });

        msg.guild!.channels.create(parsed.payload, {
            type: 'text',
            parent: category.recruit,
            // @ts-ignore
            permissionOverwrites: permissionOverwrites,
            topic: `作成者: ${msg.author.username}`
        }).then((ch: TextChannel) => {

            ch.createInvite({maxAge: 86400 * 7}).then((invite: Discord.Invite) => {
                create_channel({
                    owner: msg.author.id,
                    owner_name: msg.author.username,
                    channel_name: parsed.payload,
                    text_channel: `${ch.id}`,
                    voice_channel: ''
                }).then((ch_data) => {
                    msg.channel.send(`募集チャンネル「<#${ch.id}>」を作成しました。`);
                }).catch(console.error);
            });
        }).catch(console.error);
    });
}

export default func;