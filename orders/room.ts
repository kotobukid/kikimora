import Discord, {Message, PermissionOverwrites, TextChannel, VoiceChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload} from "../functions";
import {create_channel} from "../models";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const channel_name = parsed.payload;

    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }

    let text_category_id = '';
    let voice_category_id = '';
    if (parsed.order === '!教室') {
        text_category_id = category.text;
        voice_category_id = category.voice;
    } else {
        text_category_id = category.text_cp
        voice_category_id = category.voice_cp;
    }

    client.channels.fetch(text_category_id, false, true).then(text_category => {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        // @ts-ignore
        const permissionOverwrites: Map<string, PermissionOverwrites> = text_category.permissionOverwrites;
        permissionOverwrites.set(`${msg.author.id}`, {
            id: msg.author.id,
            // @ts-ignore
            allow: ['MANAGE_CHANNELS'],
        });

        msg.guild!.channels.create(channel_name, {
            type: 'text',
            parent: text_category_id,
            // @ts-ignore
            permissionOverwrites: permissionOverwrites,
            topic: `作成者: ${msg.author.username}`
        }).then((text_channel_created: TextChannel) => {

            client.channels.fetch(voice_category_id, false, true).then(voice_category => {
                if (!voice_category) {
                    msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                    return;
                }

                // @ts-ignore
                const permissionOverwrites_v: Map<string, PermissionOverwrites> = voice_category.permissionOverwrites;
                permissionOverwrites_v.set(`${msg.author.id}`, {
                    id: msg.author.id,
                    // @ts-ignore
                    allow: ['MANAGE_CHANNELS'],
                });

                msg.guild!.channels.create(channel_name, {
                    type: 'voice',
                    parent: voice_category_id,
                    // @ts-ignore
                    permissionOverwrites: permissionOverwrites_v,
                    topic: `作成者: ${msg.author.username}`
                }).then((voice_channel_created: VoiceChannel) => {

                    text_channel_created.createInvite().then((invite: Discord.Invite) => {
                        create_channel({
                            owner: msg.author.id,
                            owner_name: msg.author.username,
                            channel_name: parsed.payload,
                            text_channel: `${text_channel_created.id}`,
                            voice_channel: `${voice_channel_created.id}`
                        }).then((ch_data) => {
                            msg.channel.send(`教室「${parsed.payload}」を作成しました: https://discord.gg/${invite.code}`);
                        }).catch(console.error);
                    })
                })
            });
        }).catch((err: Error) => {
            console.error(err);
        });
    });
};

export default func;