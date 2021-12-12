import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {Channel} from "../models/channel";
import _ from 'lodash';
import async, {AsyncFunction} from 'async';

const func = (client: KikimoraClient, msg: any) => {
    msg.channel.send(`<@!${msg.author.id}> メンテナンスモードを開始します。`);
    find_channel({
        is_deleted: false
    }).then((channels: Channel []) => {
        const funcs: AsyncFunction<unknown, Error>[] = _.map(channels, (ch: Channel) => {
            return (done: Function) => {
                client.channels.fetch(ch.text_channel, {allowUnknownGuild: true}).then(tc => {
                    done(null, null);
                }).catch((e: Error) => {
                    find_channel({
                        id: ch.id
                    }).then((channels_to_delete: Channel[]) => {
                        if (channels_to_delete.length > 0) {
                            // @ts-ignore
                            channels_to_delete[0].update({is_deleted: true}).then(() => {
                                done(null, '#' + channels_to_delete[0].channel_name);
                            })
                        } else {
                            done(e, null);
                        }
                    })
                });
            };
        });

        // @ts-ignore
        async.series(funcs, (e: any, results: any[]): void => {
            const deleted: string[] = _.filter(results, r => r) as string[]
            if (deleted.length > 0) {
                msg.channel.send(`<@!${msg.author.id}> 削除済みチャンネルの状態をデータベースに反映させました。\n${deleted.join('\n')}\nメンテナンスモードを終了します。`)
            } else {
                msg.channel.send(`<@!${msg.author.id}> 処置の必要はありませんでした。メンテナンスモードを終了します。`);
            }
        });
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;