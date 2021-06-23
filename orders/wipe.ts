import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {Channel, ChannelSource} from "../models/channel";
import _ from 'lodash';

const func = (client: KikimoraClient, msg: any) => {
    find_channel({
        owner: msg.author.id,
        is_deleted: false
    }).then((channels: Channel []) => {
        for (let i: number = 0; i < channels.length; i++) {
            const ch: Channel = channels[i];

            client.channels.fetch(channels[i].text_channel, false, true).then(tc => {
            }).catch((e: Error) => {
                find_channel({
                    id: ch.id
                }).then((channels_to_delete: Channel[]) => {
                    _.each(channels_to_delete, (ch_d: ChannelSource) => {
                        // @ts-ignore
                        ch_d.update({is_deleted: true}).then();

                        console.log(`削除済みチャンネル:${ch_d.channel_name} の状態をデータベースに反映させました。`);
                    })
                })
            });
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;