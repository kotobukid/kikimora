import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {Channel} from "../models/channel";
import _ from 'lodash';
import async, {AsyncFunction} from 'async';
import {AnyChannel, Message} from "discord.js";

const func = (client: KikimoraClient, msg: Message): void => {
    msg.channel.send(`<@!${msg.author.id}> メンテナンスモードを開始します。`);
    find_channel({
        is_deleted: 0
    }).then((channels: Channel []): void => {
        const funcs: AsyncFunction<unknown, Error>[] = _.map(channels, (ch: Channel) => {
            return (done: Function): void => {
                client.channels.fetch(ch.text_channel).then((tc: AnyChannel | null): void => {
                    done(null, null);
                }).catch((e: Error): void => {
                    find_channel({
                        id: ch.id
                    }).then((channels_to_delete: Channel[]): void => {
                        if (channels_to_delete.length > 0) {
                            // @ts-ignore
                            channels_to_delete[0].update({is_deleted: true}).then((): void => {
                                done(null, '#' + channels_to_delete[0].channel_name);
                            });
                        } else {
                            done(e, null);
                        }
                    });
                });
            };
        });

        // @ts-ignore
        async.series(funcs, (e: any, results: any[]): void => {
            const deleted: string[] = _.filter(results, r => r) as string[]

            if (deleted.length > 0) {
                msg.channel.send(`<@!${msg.author.id}> 削除済みチャンネルの状態をデータベースに反映させました。\n${deleted.join('\n')}\nメンテナンスモードを終了します。`);
            } else {
                msg.channel.send(`<@!${msg.author.id}> 処置の必要はありませんでした。メンテナンスモードを終了します。`);
            }
        });
    }).catch((err: Error): void => {
        console.error(err);
    });
}

export default func;