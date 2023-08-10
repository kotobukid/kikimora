import {AnyChannel, Channel, Message} from 'discord.js';
import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";

const func = (client: KikimoraClient, msg: Message): void => {

    find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then((channels: ChannelSource []): void => {
        for (let i: number = 0; i < channels.length; i++) {
            client.channels.fetch(channels[i].text_channel).then((tc: AnyChannel | null): void => {
                if (tc) {
                    tc.delete().then((tc_deleted: Channel): void => {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then((vc: AnyChannel | null): void => {
                                if (vc) {
                                    vc.delete().then((vc_deleted: Channel): void => {
                                        // @ts-ignore
                                        channels[i].update({is_deleted: true}).then();
                                    });
                                } else {
                                    // @ts-ignore
                                    channels[i].update({is_deleted: true}).then();
                                }
                            }).catch((): void => {
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
    }).catch((err: Error): void => {
        console.error(err)
    });
}

export default func;