import {Channel, Message} from 'discord.js';
import {KikimoraClient} from "../types";
import {find_channel_expired} from "../models";
import {ChannelSource} from "../models/channel";

export const delete_channels_expired = (client: KikimoraClient) => {
    console.log('"delete_channels_expired" is kicked.')
    // @ts-ignore
    find_channel_expired().then((channels: ChannelSource []) => {
        if (channels.length > 0) {
            console.log(`${channels.length} channel(s) found.`);
        }

        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel).then(tc => {
                if (tc) {
                    tc.delete().then((tc_deleted: Channel) => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then(vc => {
                                if (vc) {
                                    vc.delete().then((vc_deleted: Channel) => {
                                        // @ts-ignore
                                        channels[i].update({is_deleted: true}).then();
                                    });
                                } else {
                                    // @ts-ignore
                                    channels[i].update({is_deleted: true}).then();
                                }
                            }).catch(() => {
                                // @ts-ignore
                                channels[i].update({is_deleted: true}).then();
                            });
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

const func = (client: KikimoraClient, msg: Message) => {
    delete_channels_expired(client);
}

export default func
