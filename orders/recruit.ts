import Discord, {GuildChannelCreateOptions, Message, PermissionOverwrites, TextChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload, sanitize_channel_name} from "../functions";
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

        let channel_name = sanitize_channel_name(parsed.payload);

        const everyoneRole = msg.guild!.roles.everyone;

        const permissionSettings: any[] = [
            {
                id: everyoneRole.id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: msg.author.id,
                allow: ['MANAGE_CHANNELS']
            }
        ];

        // @ts-ignore
        msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
            type: 'text',
            parent: category.recruit,
            permissionOverwrites: permissionSettings,
            topic: `作成者: ${msg.author.username}`
            // @ts-ignore
        }).then((ch: TextChannel) => {

            ch.createInvite({maxAge: 86400 * 7}).then((invite: Discord.Invite) => {
                create_channel({
                    owner: msg.author.id,
                    owner_name: msg.author.username,
                    channel_name: channel_name,
                    text_channel: `${ch.id}`,
                    voice_channel: ''
                }).then((ch_data) => {
                    msg.channel.send(`募集チャンネル「<#${ch.id}>」を作成しました。`);
                }).catch(console.error);
            });
        });
    });
}

export default func;