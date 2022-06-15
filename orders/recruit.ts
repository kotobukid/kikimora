import Discord, {
    GuildChannelCreateOptions,
    Message,
    NonThreadGuildBasedChannel,
    PermissionOverwrites,
    TextChannel,
    PermissionOverwriteOptions, Snowflake,
} from 'discord.js';
import {KikimoraClient, ParsedMessage} from "../types";
import {category} from "../config";
import {get_payload, sanitize_channel_name, omit_id} from "../functions";
import {create_channel} from "../models";
import async, {AsyncFunction} from "async";
import _ from 'lodash';
import {ChannelTypes} from "discord.js/typings/enums";
import {get_date_to_delete, parse_datetime} from "../sample_scripts/parse_datetime";

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

    const dt_parsed: ParsedMessage = parse_datetime(parsed.payload);
    const _channel_name: string = dt_parsed.message_payload;
    const delete_date: { s: string, n: string } = get_date_to_delete(dt_parsed);

    // @ts-ignore
    client.channels.fetch(category.recruit, false, true).then((recruit_category: Discord.Channel & { permissionOverwrites: Map<string, PermissionOverwrites> }) => {

        if (!recruit_category) {
            msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }

        if (parsed.payload.trim() === '') {
            msg.channel.send("募集チャンネルの名前を指定してください。").then();
            return;
        }

        let channel_name = sanitize_channel_name(_channel_name);

        const everyoneRole = msg.guild!.roles.everyone;

        const permissionSettings: ({ id: Snowflake } & PermissionOverwriteOptions)[] = [
            {
                id: everyoneRole.id,
                VIEW_CHANNEL: true,
            },
            {
                id: msg.author.id,
                MANAGE_CHANNELS: true
            }
        ];

        msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
            type: ChannelTypes.GUILD_TEXT,
            parent: category.recruit,
            topic: `作成者: ${msg.author.username}`

            // @ts-ignore
        }).then((ch: TextChannel) => {
            ch.lockPermissions()
                .then(() => {
                    async.series(_.map(permissionSettings, (p: { id: Snowflake } & PermissionOverwriteOptions) => {
                        return ((done: AsyncFunction<boolean, Error>) => {
                            const id: string = p.id!;
                            const pop: PermissionOverwriteOptions = omit_id(p);

                            // @ts-ignore
                            ch.permissionOverwrites.create(id, pop).then((_ch: NonThreadGuildBasedChannel, err) => {
                                done(err);
                            });
                        });
                    }), () => {
                        ch.createInvite({maxAge: 86400 * 7}).then((invite: Discord.Invite) => {
                            create_channel({
                                owner: msg.author.id,
                                owner_name: msg.author.username,
                                channel_name: channel_name,
                                text_channel: `${ch.id}`,
                                voice_channel: '',
                                deleted_at: delete_date.n
                            }).then((ch_data) => {
                                msg.channel.send(`募集チャンネル「<#${ch.id}>」を作成しました。`).then();
                                if (delete_date.n !== '') {
                                    ch.send(`この募集チャンネルは${delete_date.s}に削除予定です。`).then();
                                } else {
                                    ch.send(`この募集チャンネルには自動削除予定が設定されていません。`).then();
                                }
                            }).catch(console.error);
                        });
                    })
                })
                .catch(console.error);
        });
    });
}

export default func;