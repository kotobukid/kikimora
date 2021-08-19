import {Channel} from 'discord.js';
import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";

const func = (client: KikimoraClient, msg: any) => {

    find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then((channels: ChannelSource []) => {
        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel, false, true).then(tc => {
                if (tc) {
                    tc.delete().then((tc_deleted: Channel) => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(vc => {
                                if (vc) {
                                    vc.delete().then((vc_deleted: Channel) => {
                                        // @ts-ignore
                                        channels[i].update({is_deleted: true}).then();
                                    });
                                }
                            }).catch(console.error);
                        } else {
                            // @ts-ignore
                            channels[i].update({is_deleted: true}).then();
                        }
                    });
                }
            }).catch(console.error);
        }
    }).catch((err: Error) => {
        console.error(err)
    });
}

export default func;