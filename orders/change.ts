import Discord, {Channel, Message, TextChannel, VoiceChannel} from 'discord.js';
import {KikimoraClient} from "../types";
import {token, category} from "../config";
import {get_payload} from "../functions";
import {create_channel, find_channel} from "../models";
import {ChannelSource} from "../models/channel";

const func = (client: KikimoraClient, msg: any) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const new_title: string = parsed.payload;

    find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then((channels: ChannelSource []) => {
        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel, false, true).then((tc) => {
                if (tc) {
                    // @ts-ignore
                    tc.setName(new_title, 'reason: test').then((_tc) => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(vc => {
                                if (vc) {
                                    // @ts-ignore
                                    vc.setName(new_title).then(() => {
                                        // @ts-ignore
                                        channels[i].update({channel_name: new_title}).then();
                                    });
                                } else {
                                    msg.channel.send(`チャンネル名を「${new_title}」に変更しました。`);
                                }
                            });
                        }
                    }).catch(console.error);
                }
            });
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;