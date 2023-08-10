import {KikimoraClient, OrderSet} from "../types";
import {get_orders} from "../functions";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";
import {AnyChannel, Message} from "discord.js";

const func = (client: KikimoraClient, msg: Message): void => {
    // const {order, payload}: OrderSet = get_orders(msg);
    // const new_title: string = parsed.payload;

    find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: 0
    }).then((channels: ChannelSource []): void => {
        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel).then((tc: AnyChannel | null): void => {
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
                    tc.setName(new_title).then((): void => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then((vc: AnyChannel | null): void => {
                                if (vc) {
                                    // @ts-ignore
                                    vc.setName(new_title).then((): void => {
                                        // @ts-ignore
                                        channels[i].update({channel_name: new_title}).then().catch((e: error): void => {
                                            console.error(e);
                                        });
                                        msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                                    });
                                } else {
                                    // @ts-ignore
                                    channels[i].update({channel_name: new_title}).then().catch((e: error): void => {
                                        console.error(e);
                                    });
                                    msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                                }
                            }).catch((e: Error): void => {
                                console.error(e);
                                msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>\nボイスチャンネルをみつけることができませんでした。`);
                            });
                        } else {
                            msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`);
                        }
                    }).catch((e: Error): void => {
                        console.error(e);
                        msg.channel.send(`<@!${msg.author.id}> チャンネル名の変更に失敗しました。`);
                    });
                }
            });
        }
    }).catch((err: Error): void => {
        console.error(err)
    });
}

export default func;