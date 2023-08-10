import {KikimoraClient, OrderSet} from "../types";
import {get_orders} from "../functions";
import {
    create_message_room,
    create_summon_cache,
    fetch_message_room,
    fetch_summon_target,
    find_channel
} from "../models";
import {ChannelSource} from "../models/channel";
import Discord, {
    Message,
    CategoryChannel,
    TextChannel,
    DiscordAPIError, PermissionOverwriteOptions, Snowflake
} from "discord.js";
import {SummonCache} from "../models/summon_cache";
import {MessageRoom} from "../models/message_room";
import async, {AsyncFunction} from 'async';
import _ from 'lodash';

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

const func = (client: KikimoraClient, msg: Message): void => {
    // const {order, payload}: OrderSet = get_orders(msg);

    find_channel({owner: msg.author.id, is_deleted: 0}, 10, true).then((channels: ChannelSource[]): void => {
        if (channels.length === 0) {
            msg.channel.send('あなたの作成したチャンネルを見つけられませんでした。');
        } else if (channels.length === 1) {
            //     // 当該ユーザーが作成したチャンネルが一つしかない
            msg.channel.send(`「<#${channels[0].text_channel}>」に参加したい人は✅でリアクションしてください。\n(30日間有効)`).then((sent_message: Discord.Message): void => {
                create_message_room({
                    message: sent_message.id,
                    text_channel: channels[0].text_channel,
                    voice_channel: channels[0].voice_channel || '',
                }, (): void => {
                    try {
                        sent_message.react('✅').then();
                    } catch (e) {
                        console.error(e);
                    }
                });
            }).catch(console.error);
        } else {
            // 当該ユーザーが作成したチャンネルが複数ある
            const async_funcs: Array<AsyncFunction<unknown, Error>> = channels.map((ch: ChannelSource) => {
                return (done: Function): void => {
                    // @ts-ignore
                    client.channels.fetch(ch.text_channel, false, true).then((text_channel: TextChannel | undefined): void => {
                        if (text_channel) {
                            if (text_channel.parentId) {
                                // @ts-ignore
                                client.channels.fetch(text_channel.parentId).then((category: CategoryChannel): void => {
                                    done(null, {
                                        text_name: text_channel.name,
                                        text_id: ch.text_channel,
                                        voice_id: ch.voice_channel || '',
                                        category_name: category.name,
                                    });
                                });
                            } else {
                                // カテゴリーに所属していないチャンネル
                                done(null, {
                                    text_name: text_channel.name,
                                    text_id: ch.text_channel,
                                    voice_id: ch.voice_channel || '',
                                    category_name: '',
                                });
                            }
                        } else {
                            done(null, null);
                        }
                    }).catch((e: DiscordAPIError): void => {
                        done(null, null);   // エラーはここでは無視
                    });
                }
            });

            // @ts-ignore
            async.series(async_funcs, (err: Error | undefined, _cs: ({
                text_name: string,
                text_id: string,
                voice_id: string,
                category_name: string,
            } | null)[]): void => {
                if (err) {
                    throw err;
                }

                const emojis: string[] = [
                    '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'
                ];

                const over_limit_message: string = channels.length > 10 ? '\n※10個め以降は省略されました' : '';

                const reactions: Record<string, { text: string, voice: string, category_name: string }> = {};

                const cs = _.filter(_cs, (__cs) => {
                    return !!__cs;
                });

                const mapping: string = _.filter(_cs.map(((c, index: number): string => {
                    if (!!c) {
                        reactions[emojis[index]] = {text: c.text_id, voice: c.voice_id, category_name: c.category_name};
                        return `${emojis[index]} ${c.category_name} <#${c.text_id}>`;
                    } else {
                        return '';
                    }
                }))).join('\n');

                msg.channel.send(`<@!${msg.author.id}> 招待状を作成したいチャンネルの番号にリアクションしてください。${over_limit_message}\n(30日間有効)\n${mapping}`).then((sent_message: Discord.Message) => {
                    create_summon_cache({
                        owner: msg.author.id,
                        reactions: reactions,
                        message: sent_message.id
                    }, (): void => {

                        for (let i: number = 0; i < cs.length; i++) {
                            if (i < emojis.length) {
                                setTimeout((): void => {
                                    try {
                                        sent_message.react(emojis[i]).then();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }, (1 + i) * 16)
                            } else {
                                break;
                            }
                        }
                    });
                });
            });
        }
    });
}

const add_user_as_channel_controller = (channels: Discord.GuildChannelManager, room_info: RoomInfo, user_id: Snowflake, next: (result: boolean) => void) => {
    // @ts-ignore
    const t_c: Discord.GuildChannel | null = channels.resolve(room_info.text_channel);

    if (t_c == null) {
        next(false);
    } else {
        const pop: PermissionOverwriteOptions = {
            VIEW_CHANNEL: true
        };

        t_c.permissionOverwrites.create(user_id, pop).then();

        // @ts-ignore
        const v_c: Discord.GuildChannel | null = channels.resolve(room_info.voice_channel);

        if (v_c == null) {
            next(true);
        } else {
            v_c.permissionOverwrites.create(user_id, pop).then();

            next(true);
        }
    }
};

const suggest_invite = (message: Discord.Message, sc: SummonCache, channel?: ChannelSource): void => {
    message.delete().then((message_deleted: Message): void => {
        message.channel.send(`「<#${sc.text}>」に参加したい人は✅でリアクションしてください。\n(30日間有効)`).then((sent_message: Discord.Message): void => {
            create_message_room({
                message: sent_message.id,
                text_channel: sc.text,
                voice_channel: sc.voice
            }, (): void => {
                try {
                    sent_message.react('✅').then();
                } catch (e) {
                    console.error(e);
                }
            })
        });
    });
}

const invite_reaction = (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser): void => {
    if (user.bot) {
        return;
    }

    if (!'' + reaction.message.id in reaction_check_information) {
        // 無関係なリアクション
        // console.log('無関係なリアクション')
        return;
    }

    // @ts-ignore
    fetch_summon_target({
        message: reaction.message.id,
        react: reaction.emoji.name || '',
        owner: user.id
    }).then((sc: SummonCache): void => {
        // @ts-ignore
        const c: Discord.GuildChannel | null = reaction.message.guild!.channels.resolve(sc.text);
        if (!c) {
            console.log('channel not found 1')
            return;
        }
        // @ts-ignore
        suggest_invite(reaction.message, sc);
    }).catch((): void => {
        // ☑が押された時
        fetch_message_room(reaction.message.id, (mr: MessageRoom): void => {
            if (mr) {
                add_user_as_channel_controller(reaction.message.guild!.channels, {
                    text_channel: mr.text_channel,
                    voice_channel: mr.voice_channel
                }, user.id, (result: boolean): void => {
                    if (result) {
                        reaction.message.channel.send(`<@!${user.id}> に「<#${mr.text_channel}>」への入室権限を付与しました。`);
                    }
                });
            }
        })
    })
}

export default func;
export {invite_reaction};