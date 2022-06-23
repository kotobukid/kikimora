import {AnyChannel, Channel, Message, TextChannel} from 'discord.js';
import {KikimoraClient, ParsedMessage} from "../types";
import {find_channel_expired, find_channel_expired_on_date} from "../models";
import {ChannelSource} from "../models/channel";
import {AsyncFunction} from "async";
import _ from 'lodash';
import async from "async";
import {get_date_to_delete} from "../sample_scripts/parse_datetime";

const generate_today_string = (days_offset?: number): string => {
    let parsed_dt!: ParsedMessage;
    const today = new Date();

    if (days_offset == undefined) {
        parsed_dt = {
            m: `${today.getMonth() + 1}`,
            d: `${today.getDate()}`,
            message_payload: ''
        };
    } else {
        const target_day: Date = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() + days_offset}`);
        parsed_dt = {
            m: `${target_day.getMonth() + 1}`,
            d: `${target_day.getDate()}`,
            message_payload: ''
        };
    }
    return get_date_to_delete(parsed_dt).n; // (+2 days)
};

export const warn_channels_to_delete = (client: KikimoraClient, threshold_date: string) => {
    const today_string = generate_today_string();
    console.log(`${today_string} warn_channels_to_delete()`);

    find_channel_expired_on_date(threshold_date).then((channels: ChannelSource[]) => {
        const funcs: AsyncFunction<any, any>[] = _.map(channels, (ch: ChannelSource) => {
            return (done: Function) => {
                client.channels.fetch(ch.text_channel).then((tc: AnyChannel | null) => {
                    if (tc && tc instanceof TextChannel) {
                        tc.send(`<@!${ch.owner}> 自動削除予定日が近付いています。削除予定を延期する場合は \`!変更\` コマンドでセッション予定日を含むチャンネル名を設定してください。`).then(() => {
                            done()
                        }).catch((e: Error) => {
                            console.log(e);
                        });
                    }
                });
            }
        });

        async.series(funcs, () => {
        })
    })
};

const rehearsal_mode: boolean = true;

export const delete_channels_expired = (client: KikimoraClient) => {
    console.log('"delete_channels_expired" is kicked.')

    find_channel_expired().then((channels: ChannelSource []) => {
        if (channels.length > 0) {
            console.log(`${channels.length} channel(s) found.`);
        }

        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel).then((tc: AnyChannel | null) => {
                console.log(tc);
                if (tc) {
                    if (rehearsal_mode) {
                        if (tc instanceof TextChannel) {
                            tc.send('このチャンネルは削除される予定でした（リハーサル）').then().catch((e: Error) => {
                                console.log(e);
                            });
                        }
                    } else {
                        tc.delete().then((tc_deleted: Channel) => {
                            if (channels[i].voice_channel) {
                                client.channels.fetch(channels[i].voice_channel).then(vc => {
                                    console.log(vc)
                                    if (vc) {
                                        vc.delete().then((vc_deleted: Channel) => {
                                            // @ts-ignore
                                            channels[i].update({is_deleted: true}).then();
                                        }).catch((e: Error) => {
                                            console.log('A');
                                            console.log(e);
                                        });
                                    } else {
                                        // @ts-ignore
                                        channels[i].update({is_deleted: true}).then();
                                    }
                                }).catch((e: Error) => {
                                    console.log(e);
                                    console.log('C');
                                    // @ts-ignore
                                    channels[i].update({is_deleted: true}).then();
                                });
                            } else {
                                // @ts-ignore
                                channels[i].update({is_deleted: true}).then();
                            }
                        }).catch((e: Error) => {
                            console.log('B');
                            console.log(e);
                        });
                    }
                }
            }).catch((e: Error) => {
                if (!rehearsal_mode) {
                    // @ts-ignore
                    channels[i].update({is_deleted: true}).then();
                }
                console.error(e);
            });
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

const func = (client: KikimoraClient, msg: Message) => {
    delete_channels_expired(client);
}

export default func
