import {KikimoraClient} from "../types";
import {get_payload} from "../functions";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";
import {Channel} from "discord.js";

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
            client.channels.fetch(channels[i].text_channel, false, true).then((tc: Channel) => {
                if (tc) {
                    // @ts-ignore
                    const name: string = tc.name;
                    let new_title: string = '';
                    if (name.indexOf('〆') !== 0) {
                        new_title = '〆' + name;
                    } else {
                        new_title = name.replace(/〆/, '');  // 最初に見つけた一つだけを置き換える
                    }

                    // @ts-ignore
                    tc.setName(new_title).then(() => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(vc => {
                                if (vc) {
                                    // @ts-ignore
                                    vc.setName(new_title).then(() => {
                                        // @ts-ignore
                                        channels[i].update({channel_name: new_title}).then().catch((e: error) => {
                                            console.error(e);
                                        });
                                        msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                                    });
                                } else {
                                    msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                                }
                            }).catch((e: Error) => {
                                console.error(e);
                                msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>\nボイスチャンネルをみつけることができませんでした。`);
                            });
                        } else {
                            msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                        }
                    }).catch((e: Error) => {
                        console.error(e);
                        msg.channel.send(`<@!${msg.author.id}> チャンネル名の変更に失敗しました。`);
                    });
                }
            });
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;