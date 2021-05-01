import Discord, {TextChannel, VoiceChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload} from "../functions";
import {create_channel} from "../models";

const func = (client: KikimoraClient, msg: any) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    let text_category = '';
    let voice_category = '';
    if (parsed.order === '!教室') {
        text_category = category.text;
        voice_category = category.voice;
    } else {
        text_category = category.text_cp
        voice_category = category.voice_cp;
    }

    const channel_name = parsed.payload;

    msg.guild!.channels.create(channel_name, {
        type: 'text',
        parent: text_category,
        permissionOverwrites: [
            {
                id: msg.author.id,
                allow: ['MANAGE_CHANNELS'],
            },
        ]
    }).then((text_channel_created: TextChannel) => {
        text_channel_created.setTopic(`作成者: ${msg.author.username}`)

        msg.guild!.channels.create(channel_name, {
            type: 'voice',
            parent: voice_category,
            permissionOverwrites: [
                {
                    id: msg.author.id,
                    allow: ['MANAGE_CHANNELS'],
                },
            ]
        }).then((voice_channel_created: VoiceChannel) => {
            voice_channel_created.setTopic(`作成者: ${msg.author.username}`)
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
    })
        .catch((err: Error) => {
            console.error(err);
        });
}

export default func;