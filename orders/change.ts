import {KikimoraClient} from "../types";
import {get_payload} from "../functions";
import {find_channel} from "../models";
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
            client.channels.fetch(channels[i].text_channel, {allowUnknownGuild: true}).then((tc) => {
                if (tc) {
                    // @ts-ignore
                    tc.setName(new_title, `reason: kikimora order from ${msg.author.username}`).then((_tc) => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, {allowUnknownGuild: true}).then(vc => {
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