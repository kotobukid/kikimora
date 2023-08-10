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
    const today: Date = new Date();

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

export const warn_channels_to_delete = (client: KikimoraClient, threshold_date: string): void => {
    const today_string: string = generate_today_string();
    console.log(`${today_string} warn_channels_to_delete()`);

    find_channel_expired_on_date(threshold_date).then((channels: ChannelSource[]): void => {
        const funcs: AsyncFunction<any, any>[] = _.map(channels, (ch: ChannelSource) => {
            return (done: Function): void => {
                client.channels.fetch(ch.text_channel).then((tc: AnyChannel | null): void => {
                    if (tc && tc instanceof TextChannel) {
                        console.log(`削除予定通知 to "${tc.name}"`)
                        tc.send(`<@!${ch.owner}> 自動削除予定日が近付いています。削除予定を延期する場合は \`!変更\` コマンドでセッション予定日を含むチャンネル名を設定してください。`).then(() => {
                            done()
                        }).catch((e: Error): void => {
                            console.log(e);
                        });
                    }
                }).catch((e: Error): void => {
                    console.log('not found3');
                });
            }
        });

        async.series(funcs, (): void => {
        })
    })
};

const rehearsal_mode: boolean = true;

export const delete_channels_expired = (client: KikimoraClient): void => {
    console.log('"delete_channels_expired" is kicked.')

    find_channel_expired().then((channels: ChannelSource []): void => {
        if (channels.length > 0) {
            console.log(`${channels.length} channel(s) found.`);
        }

        for (let i: number = 0; i < channels.length; i++) {
            // console.log(channels[i])
            client.channels.fetch(channels[i].text_channel).then((tc: AnyChannel | null): void => {
                if (tc) {
                    if (rehearsal_mode) {
                        if (tc instanceof TextChannel) {
                            console.log(`削除メッセージ(リハーサル) to "${tc.name}"`)
                            tc.send('このチャンネルは削除されました（リハーサルによりメッセージのみ）').then().catch((e: Error): void => {
                                console.log(e);
                            });
                        }
                    } else {
                        tc.delete().then((tc_deleted: Channel): void => {
                            if (channels[i].voice_channel) {
                                client.channels.fetch(channels[i].voice_channel).then((vc: AnyChannel | null): void => {
                                    console.log(vc)
                                    if (vc) {
                                        vc.delete().then((vc_deleted: Channel): void => {
                                            // @ts-ignore
                                            channels[i].update({is_deleted: true}).then();
                                        }).catch((e: Error): void => {
                                            console.log(e);
                                        });
                                    } else {
                                        // @ts-ignore
                                        channels[i].update({is_deleted: true}).then();
                                    }
                                }).catch((e: Error): void => {
                                    console.log(e);
                                    // @ts-ignore
                                    channels[i].update({is_deleted: true}).then();
                                });
                            } else {
                                // @ts-ignore
                                channels[i].update({is_deleted: true}).then();
                            }
                        }).catch((e: Error): void => {
                            console.log(e);
                        });
                    }
                } else {
                }
            }).catch((e: Error): void => {
                if (!rehearsal_mode) {
                    // @ts-ignore
                    channels[i].update({is_deleted: true}).then();
                }
                console.error(e);
            });
        }
    }).catch((err: Error): void => {
        console.error(err)
    });
}

const func = (client: KikimoraClient, msg: Message): void => {
    delete_channels_expired(client);
}

export default func
