import {KikimoraClient, ParsedMessage} from "../types";
import {get_payload, sanitize_channel_name} from "../functions";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";
import {Message} from "discord.js";
import {get_date_to_delete, parse_datetime, to_channel_name_date} from "../sample_scripts/parse_datetime";

const func = (client: KikimoraClient, msg: Message) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const dt_parsed: ParsedMessage = parse_datetime(parsed.payload);
    const _channel_name: string = dt_parsed.message_payload;
    const delete_date: { s: string, n: string } = get_date_to_delete(dt_parsed);

    let channel_name = sanitize_channel_name(_channel_name);
    const new_title = `${to_channel_name_date(dt_parsed)}${channel_name}`;

    find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then((channels: ChannelSource []) => {
        for (let i: number = 0; i < channels.length; i++) {
            const prevent_auto_delete: boolean = channels[i].prevent_auto_delete !== 0;

            client.channels.fetch(channels[i].text_channel).then((tc) => {
                if (tc) {
                    // @ts-ignore
                    tc.setName(new_title, `reason: kikimora order from ${msg.author.username}`).then((_tc) => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then(vc => {
                                if (vc) {
                                    // vcがあるので教室/キャンペーンチャンネル
                                    // @ts-ignore
                                    vc.setName(new_title).then(() => {
                                        // @ts-ignore
                                        channels[i].update({
                                            channel_name: new_title,
                                            deleted_at: delete_date.n
                                            // @ts-ignore
                                        }).then().catch((e: error) => {
                                            console.error(e);
                                        });
                                        msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`).then(() => {
                                            if (!prevent_auto_delete) {
                                                if (delete_date.n !== '') {
                                                    // @ts-ignore
                                                    tc.send(`このチャンネルは${delete_date.s}に削除予定です。`).then();
                                                } else {
                                                    // @ts-ignore
                                                    tc.send(`このチャンネルには自動削除予定が設定されていません。`).then();
                                                }
                                            } else {
                                                // @ts-ignore
                                                tc.send(`このチャンネルは自動削除対象外に設定されています。`).then();
                                            }
                                        });
                                    });
                                } else {
                                    // vcのIDは記録されているがサーバーからは見つけられない(手動削除済みなど)
                                    msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`).then(() => {
                                        if (!prevent_auto_delete) {
                                            if (delete_date.n !== '') {
                                                // @ts-ignore
                                                tc.send(`このチャンネルは${delete_date.s}に削除予定です。`).then();
                                            } else {
                                                // @ts-ignore
                                                tc.send(`このチャンネルには自動削除予定が設定されていません。`).then();
                                            }
                                        } else {
                                            // @ts-ignore
                                            tc.send(`このチャンネルは自動削除対象外に設定されています。`).then();
                                        }
                                    });
                                }
                            }).catch((e: Error) => {
                                console.error(e);
                                msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>\nボイスチャンネルをみつけることができませんでした。`).then(() => {
                                    if (delete_date.n !== '') {
                                        // @ts-ignore
                                        tc.send(`このチャンネルは${delete_date.s}に削除予定です。`).then();
                                    } else {
                                        // @ts-ignore
                                        tc.send(`このチャンネルには自動削除予定が設定されていません。`).then();
                                    }
                                }).catch((e: Error) => {
                                    console.log(e);
                                });
                            });
                        } else {
                            // voice_channelがない場合(==募集チャンネル)
                            // @ts-ignore
                            channels[i].update({
                                channel_name: new_title,
                                deleted_at: delete_date.n
                                // @ts-ignore
                            }).then().catch((e: error) => {
                                console.error(e);
                            });

                            msg.channel.send(`<@!${msg.author.id}> チャンネル名を変更しました。<#${channels[i].text_channel}>`).then(() => {
                                if (delete_date.n !== '') {
                                    // @ts-ignore
                                    tc.send(`この募集チャンネルは${delete_date.s}に削除予定です。`).then();
                                } else {
                                    // @ts-ignore
                                    tc.send(`この募集チャンネルには自動削除予定が設定されていません。`).then();
                                }
                            });
                        }
                    }).catch((e: Error) => {
                        console.error(e);
                        msg.channel.send(`<@!${msg.author.id}> チャンネル名の変更に失敗しました。`);
                    });
                } else {
                    // DB上にはチャンネルの情報があるがサーバーからは見つからない(手動削除済みなど)
                    console.log('not found1');
                }
            }).catch((e: Error) => {
                // DB上にはチャンネルの情報があるがサーバーからは見つからない(手動削除済みなど)
                console.log('not found2');
            });
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;