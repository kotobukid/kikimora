import Discord, {
    GuildChannelCreateOptions,
    Message,
    NonThreadGuildBasedChannel,
    PermissionOverwrites,
    TextChannel,
    PermissionOverwriteOptions, Snowflake
} from 'discord.js';
import {KikimoraClient} from "../types";
import {category} from "../config";
import {get_payload, sanitize_channel_name} from "../functions";
import {create_channel} from "../models";
import async, {AsyncFunction} from "async";
import _ from 'lodash';

const omit_id = <T>(o: T & {id: any}): T => {
    const next = {} as T;
    // @ts-ignore
    const keys: (keyof T)[] = Object.keys(o);
    _.each(keys, (key: keyof T) => {
        if (key !== 'id') {
            next[key] = o[key];
        }
    });
    return next;
};

const func = (client: KikimoraClient, msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();
    const parsed = get_payload(message_text);

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

        let channel_name = sanitize_channel_name(parsed.payload);

        const everyoneRole = msg.guild!.roles.everyone;

        const permissionSettings: ({id: Snowflake} & PermissionOverwriteOptions)[] = [
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
            type: 'text',
            parent: category.recruit,
            topic: `作成者: ${msg.author.username}`

            // @ts-ignore
        }).then((ch: TextChannel) => {
            ch.lockPermissions()
            .then(() => {
                async.series(_.map(permissionSettings, (p: {id: Snowflake} & PermissionOverwriteOptions) => {
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
                            voice_channel: ''
                        }).then((ch_data) => {
                            msg.channel.send(`募集チャンネル「<#${ch.id}>」を作成しました。`).then();
                        }).catch(console.error);
                    });
                })
            })
            .catch(console.error);
        });
    });
}

export default func;