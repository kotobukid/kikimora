import {AnyChannel, Channel, Message} from 'discord.js';
import {KikimoraClient} from "../types";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";

const func = async (client: KikimoraClient, msg: Message): Promise<void> => {
    try {
        const channels: ChannelSource[] = await find_channel({
            owner: msg.author.id,
            text_channel: msg.channel.id,
            is_deleted: 0
        });

        for (let channel of channels) {
            try {
                const tc: AnyChannel | null = await client.channels.fetch(channel.text_channel);
                if (tc) {
                    await tc.delete();
                    if (channel.voice_channel) {
                        try {
                            const vc: AnyChannel | null = await client.channels.fetch(channel.voice_channel);
                            if (vc) {
                                await vc.delete();
                            }
                        } catch {
                            // このブロックは、voice_channelの取得または削除に失敗した場合のみ実行されます
                        }
                    }
                }
                // @ts-ignore
                await channel.update({is_deleted: true});
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

export default func;