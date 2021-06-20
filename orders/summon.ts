import {KikimoraClient} from "../types";
import {clone_flat_map, get_payload} from "../functions";
import {find_channel} from "../models";
import {ChannelSource} from "../models/channel";
import Discord, {PermissionOverwrites} from "discord.js";

declare type RoomInfo = {
    text_channel: string,
    voice_channel: string
}
declare type ReactionCheckInfo = {
    owner: string,
    type: 'list' | 'join',
    targets: Record<string, RoomInfo>
}
declare type message_id = string;

const reaction_check_information: Record<message_id, ReactionCheckInfo> = {}
const invite_information: Record<message_id, RoomInfo> = {}

const func = (client: KikimoraClient, msg: any) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);
    find_channel({owner: msg.author.id, is_deleted: 0}, 10, true).then((channels: ChannelSource[]) => {
        if (channels.length === 0) {
            msg.channel.send('あなたの作成したチャンネルを見つけられませんでした。');
        } else if (channels.length === 1) {
            // 当該ユーザーが作成したチャンネルが一つしかない
            make_user_channel_accessible(msg, channels[0].text_channel, channels[0]);
        } else {
            // 当該ユーザーが作成したチャンネルが複数ある
            const cs: { id: string, name: string }[] = channels.map((ch: ChannelSource) => {
                return {
                    id: ch.text_channel,
                    name: ch.channel_name
                }
            })

            const emojis: string[] = [
                '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'
            ]

            const over_limit_message = channels.length > 10 ? '\n※10個め以降は省略されました': '';

            msg.channel.send(`招待状を作成したいチャンネルの番号にリアクションしてください。${over_limit_message}\n(60秒間有効)\n${cs.map(((c, index: number) => {
                return `${emojis[index]} <#${c.id}>`;
            })).join('\n')}`).then((sent_message: Discord.Message) => {

                reaction_check_information[sent_message.id] = {
                    owner: msg.author.id,
                    type: 'list',
                    targets: {}
                }

                for (let i: number = 0; i < cs.length; i++) {
                    if (i < emojis.length) {

                        reaction_check_information[sent_message.id].targets[emojis[i]] = {
                            text_channel: channels[i].text_channel || '',
                            voice_channel: channels[i].voice_channel || ''
                        };

                        setTimeout(() => {
                            try {
                                sent_message.react(emojis[i])
                            } catch (e) {
                                console.error(e);
                            }
                        }, (1 + i) * 16)
                    } else {
                        break;
                    }
                }
                setTimeout(() => {
                    delete reaction_check_information[sent_message.id];
                    sent_message.delete();
                }, 65000)
            });
        }
    });
}

const add_user_as_channel_controller = (channels: Discord.GuildChannelManager, room_info: RoomInfo, user_id: string, next: (result: boolean) => void) => {
    const t_c: Discord.GuildChannel | null = channels.resolve(room_info.text_channel);
    if (t_c == null) {
        next(false);
    } else {

        // @ts-ignore
        const permissionOverwrites_v: Map<string, PermissionOverwrites> = clone_flat_map(t_c.permissionOverwrites);

        permissionOverwrites_v.set(`${user_id}`, {
            id: user_id,
            // @ts-ignore
            allow: ['VIEW_CHANNEL'],
        });

        // @ts-ignore
        t_c.overwritePermissions(permissionOverwrites_v);

        const v_c: Discord.GuildChannel | null = channels.resolve(room_info.voice_channel);

        if (v_c == null) {
            next(true);
        } else {
            // @ts-ignore
            const permissionOverwrites_v: Map<string, PermissionOverwrites> = clone_flat_map(v_c.permissionOverwrites);

            permissionOverwrites_v.set(`${user_id}`, {
                id: user_id,
                // @ts-ignore
                allow: ['VIEW_CHANNEL'],
            });

            // @ts-ignore
            v_c.overwritePermissions(permissionOverwrites_v);

            next(true);
        }
    }

};

const find_reaction_check_info = (condition: { user_id: string, message_id: string, emoji: string }): RoomInfo | null => {
    if (condition.message_id in reaction_check_information) {
        if (reaction_check_information[condition.message_id].owner === condition.user_id) {
            const targets = reaction_check_information[condition.message_id].targets;
            return targets[condition.emoji] || null;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const find_invite_info = (condition: { message_id: string }): RoomInfo | null => {
    if (condition.message_id in invite_information) {
        return invite_information[condition.message_id];
    } else {
        return null;
    }
}

const make_user_channel_accessible = (message: Discord.Message, c_id: string, channel: ChannelSource) => {
    message.channel.send(`「<#${c_id}>」に参加したい人は✅でリアクションしてください。\n(60秒間有効)`).then((sent_message: Discord.Message) => {
        invite_information[sent_message.id] = {
            text_channel: channel.text_channel,
            voice_channel: channel.voice_channel
        }
        setTimeout(() => {
            delete invite_information[message.id];
            sent_message.delete();
        }, 65000);
        try {
            sent_message.react('✅');
        } catch (e) {
            console.error(e);
        }
    });
}

const invite_reaction = (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
    if (user.bot) {
        return;
    }

    if (!'' + reaction.message.id in reaction_check_information) {
        // 無関係なリアクション
        // console.log('無関係なリアクション')
        return;
    }

    const target: RoomInfo | null = find_reaction_check_info({
        user_id: user.id,
        message_id: reaction.message.id,
        emoji: reaction.emoji.name
    })

    if (target == null) {
        const join_target: RoomInfo | null = find_invite_info({message_id: reaction.message.id});
        if (join_target) {
            add_user_as_channel_controller(reaction.message.guild!.channels, join_target, user.id, (result: boolean) => {
                if (result) {
                    reaction.message.channel.send(`<@!${user.id}>に「<#${join_target.text_channel}>」への入室権限を付与しました。`);
                }
            });
        }
        return;
    }

    find_channel({text_channel: target.text_channel}).then((channels: ChannelSource[]) => {
        if (channels.length < 1) {
            return;
        }
        const c: Discord.GuildChannel | null = reaction.message.guild!.channels.resolve(channels[0].text_channel);
        if (!c) {
            console.log('channel not found 1')
            return;
        }

        make_user_channel_accessible(reaction.message, c.id, channels[0]);
    })
}

export default func;
export {invite_reaction};