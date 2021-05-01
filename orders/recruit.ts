import Discord, {Channel, Message, TextChannel, VoiceChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {token, category} from "../config";
import {get_payload} from "../functions";
import {create_channel} from "../models";

const func = (client: KikimoraClient, msg: any) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    client.channels.fetch(category.recruit, false, true).then(recruit_channel => {

        if (!recruit_channel) {
            msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        if (parsed.payload.trim() === '') {
            msg.channel.send("募集チャンネルの名前を指定してください。").then();
            return;
        }

        msg.guild!.channels.create(parsed.payload, {
            type: 'text',
            parent: category.recruit,
            permissionOverwrites: [
                {
                    id: msg.author.id,
                    allow: ['MANAGE_CHANNELS'],
                },
            ]
        }).then((ch: TextChannel) => {
            ch.setTopic(`作成者: ${msg.author.username}`)
            ch.createInvite().then((invite: Discord.Invite) => {
                create_channel({
                    owner: msg.author.id,
                    owner_name: msg.author.username,
                    channel_name: parsed.payload,
                    text_channel: `${ch.id}`,
                    voice_channel: ''
                }).then((ch_data) => {
                    msg.channel.send(`募集チャンネル「${parsed.payload}」を作成しました: https://discord.gg/${invite.code}`);
                }).catch(console.error);
            });
        });
    });
}

export default func;