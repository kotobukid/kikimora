import Discord, {
    Channel,
    GuildChannelCreateOptions,
    Message,
    PermissionOverwrites,
    TextChannel,
    VoiceChannel
} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {clone_flat_map, get_payload, sanitize_channel_name} from "../functions";
import {create_channel} from "../models";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const channel_name = sanitize_channel_name(parsed.payload);

    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }

    // @ts-ignore
    const everyoneRole = msg.guild.roles.cache.get(msg.guild.id);

    let text_category_id = '';
    let voice_category_id = '';
    if (parsed.order === '!教室') {
        text_category_id = category.text;
        voice_category_id = category.voice;
    } else {
        // キャンペーン
        text_category_id = category.text_cp
        voice_category_id = category.voice_cp;
    }

    // @ts-ignore
    client.channels.fetch(text_category_id).then((text_category: Channel) => {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        // @ts-ignore
        const permissionOverwrites: Map<string, PermissionOverwrites> = clone_flat_map(text_category.permissionOverwrites);

        permissionOverwrites.set(`${msg.author.id}`, {
            id: msg.author.id,
            // @ts-ignore
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
        });
        permissionOverwrites.set(everyoneRole!.id, {
            id: everyoneRole!.id,
            // @ts-ignore
            deny: ['VIEW_CHANNEL'],
        });

        msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
            type: 'text',
            parent: text_category_id,
            // @ts-ignore
            permissionOverwrites: permissionOverwrites,
            topic: `作成者: ${msg.author.username}`
            // @ts-ignore
        }).then((text_channel_created: TextChannel) => {

            client.channels.fetch(voice_category_id).then(voice_category => {
                if (!voice_category) {
                    msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                    return;
                }

                // @ts-ignore
                const permissionOverwrites_v: Map<string, PermissionOverwrites> = clone_flat_map(voice_category.permissionOverwrites);

                permissionOverwrites_v.set(`${msg.author.id}`, {
                    id: msg.author.id,
                    // @ts-ignore
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
                });
                permissionOverwrites_v.set(everyoneRole!.id, {
                    id: everyoneRole!.id,
                    // @ts-ignore
                    deny: ['VIEW_CHANNEL'],
                });

                msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'voice' }>{
                    type: 'voice',
                    parent: voice_category_id,
                    // @ts-ignore
                    permissionOverwrites: permissionOverwrites_v,
                    topic: `作成者: ${msg.author.username}`
                    // @ts-ignore
                }).then((voice_channel_created: VoiceChannel) => {

                    create_channel({
                        owner: msg.author.id,
                        owner_name: msg.author.username,
                        channel_name: parsed.payload,
                        text_channel: `${text_channel_created.id}`,
                        voice_channel: `${voice_channel_created.id}`
                    }).then((ch_data) => {
                        msg.channel.send(`教室「<#${text_channel_created.id}>」を作成しました。`);
                    }).catch(console.error);
                })
            });
        }).catch((err: Error) => {
            console.error(err);
        });
    });
};

export default func;