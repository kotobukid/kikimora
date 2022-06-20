import {
    Channel,
    GuildChannelCreateOptions,
    Message,
    NonThreadGuildBasedChannel,
    PermissionOverwriteOptions,
    Snowflake,
    TextChannel,
    VoiceChannel,
} from 'discord.js';
import {KikimoraClient, ParsedMessage} from "../types";
import {category} from "../config";
import {get_payload, omit_id, sanitize_channel_name} from "../functions";
import {create_channel} from "../models";
import async, {AsyncFunction} from "async";
import _ from "lodash";
import {ChannelTypes} from "discord.js/typings/enums";
import {get_date_to_delete, parse_datetime, to_channel_name_date} from "../sample_scripts/parse_datetime";

const func = (client: KikimoraClient, msg: Message) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const dt_parsed: ParsedMessage = parse_datetime(parsed.payload);
    const _channel_name: string = dt_parsed.message_payload;
    const delete_date: { s: string, n: string } = get_date_to_delete(dt_parsed);

    let channel_name = sanitize_channel_name(_channel_name);
    channel_name = `${to_channel_name_date(dt_parsed)}${channel_name}`;

    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }

    const everyoneRole = msg.guild!.roles.everyone;

    let text_category_id = '';
    let voice_category_id = '';
    let everyOneRolePOP: PermissionOverwriteOptions & { id: Snowflake } = {
        id: everyoneRole.id,
        VIEW_CHANNEL: true,
    };
    let prevent_auto_delete: 1 | 0 = 0;
    if (parsed.order === '!教室') {
        text_category_id = category.text;
        voice_category_id = category.voice;
    } else {
        // キャンペーン
        text_category_id = category.text_cp
        voice_category_id = category.voice_cp;
        everyOneRolePOP.VIEW_CHANNEL = false;
        prevent_auto_delete = 1;
    }

    // @ts-ignore
    client.channels.fetch(text_category_id).then((text_category: Channel) => {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        const permissionSettings: ({ id: Snowflake } & PermissionOverwriteOptions)[] = [
            everyOneRolePOP,
            {
                id: msg.author.id,
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_MESSAGES: true,
                MANAGE_THREADS: true
            }
        ];

        msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
            type: ChannelTypes.GUILD_TEXT,
            parent: text_category_id,
            topic: `作成者: ${msg.author.username} ${prevent_auto_delete ? '[永続]' : ''}`

            // @ts-ignore
        }).then((text_channel_created: TextChannel) => {

            text_channel_created.lockPermissions()
                .then(() => {
                    async.series(_.map(permissionSettings, (p: { id: Snowflake } & PermissionOverwriteOptions) => {
                        return ((done: AsyncFunction<boolean, Error>) => {
                            const id: string = p.id!;
                            const pop: PermissionOverwriteOptions = omit_id(p);

                            // @ts-ignore
                            text_channel_created.permissionOverwrites.create(id, pop).then((_ch: NonThreadGuildBasedChannel, err) => {
                                done(err);
                            });
                        });
                    }), () => {
                        client.channels.fetch(voice_category_id).then(voice_category => {
                            if (!voice_category) {
                                msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                                return;
                            }

                            const permissionOverwrites_v: ({ id: Snowflake } & PermissionOverwriteOptions)[] = [
                                everyOneRolePOP,
                                {
                                    id: msg.author.id,
                                    MANAGE_CHANNELS: true,
                                    VIEW_CHANNEL: true,
                                    MANAGE_MESSAGES: true
                                }
                            ];

                            msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'voice' }>{
                                type: ChannelTypes.GUILD_VOICE,
                                parent: voice_category_id,
                                topic: `作成者: ${msg.author.username}`

                                // @ts-ignore
                            }).then((voice_channel_created: VoiceChannel) => {
                                voice_channel_created.lockPermissions()
                                    .then(() => {
                                        async.series(_.map(permissionOverwrites_v, (p: { id: Snowflake } & PermissionOverwriteOptions) => {
                                            return ((done: AsyncFunction<boolean, Error>) => {
                                                const id: string = p.id!;
                                                const pop: PermissionOverwriteOptions = omit_id(p);

                                                // @ts-ignore
                                                voice_channel_created.permissionOverwrites.create(id, pop).then((_ch: NonThreadGuildBasedChannel, err) => {
                                                    done(err);
                                                });
                                            });
                                        }), () => {
                                            create_channel({
                                                owner: msg.author.id,
                                                owner_name: msg.author.username,
                                                channel_name: parsed.payload,
                                                text_channel: `${text_channel_created.id}`,
                                                voice_channel: `${voice_channel_created.id}`,
                                                deleted_at: delete_date.n,
                                                prevent_auto_delete
                                            }).then((ch_data) => {
                                                msg.channel.send(`教室「<#${text_channel_created.id}>」を作成しました。`);
                                                if (delete_date.n !== '') {
                                                    text_channel_created.send(`この募集チャンネルは${delete_date.s}に削除予定です。`).then();
                                                } else {
                                                    text_channel_created.send(`この募集チャンネルには自動削除予定が設定されていません。`).then();
                                                }
                                            }).catch(console.error);
                                        });
                                    });
                            });
                        });
                    });
                });
        }).catch((err: Error) => {
            console.error(err);
        });
    });
};

export default func;