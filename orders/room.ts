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
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload, omit_id, sanitize_channel_name} from "../functions";
import {create_channel} from "../models";
import async, {AsyncFunction} from "async";
import _ from "lodash";
import {ChannelTypes} from "discord.js/typings/enums";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const channel_name = sanitize_channel_name(parsed.payload);

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
    if (parsed.order === '!教室') {
        text_category_id = category.text;
        voice_category_id = category.voice;
    } else {
        // キャンペーン
        text_category_id = category.text_cp
        voice_category_id = category.voice_cp;
        everyOneRolePOP.VIEW_CHANNEL = false;
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
                VIEW_CHANNEL: true
            }
        ];

        msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
            type: ChannelTypes.GUILD_TEXT,
            parent: text_category_id,
            topic: `作成者: ${msg.author.username}`

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
                                    VIEW_CHANNEL: true
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
                                                voice_channel: `${voice_channel_created.id}`
                                            }).then((ch_data) => {
                                                msg.channel.send(`教室「<#${text_channel_created.id}>」を作成しました。`);
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