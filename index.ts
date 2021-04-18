import Discord, {Channel, Message, TextChannel, VoiceChannel} from 'discord.js';
import process from 'process';
import fs from 'fs';
import _ from 'lodash';
import {get_payload} from './functions'
import {create_channel, find_channel} from "./models"
import {ChannelSource} from "./models/channel";
import {text} from "express";

// @ts-ignore
const client: Discord.Client & { channels: { cache: Record<string, any> } } = new Discord.Client();
const UNDELETABLE_CHANNELS = ['一般', 'another'];

let token: string = '';

if (fs.existsSync('./config/secret.js')) {
    token = require('./config/secret');
    if (!token) {
        console.error('secret.js empty.');
        process.exit(1);
    }
} else {
    console.error('./config/secret.js not found.');
    process.exit(1);
}

let category = {
    text: '',
    voice: '',
    recruit: '',
    text_cp: '',
    voice_cp: ''
};

if (fs.existsSync('./config/category.js')) {
    category = require('./config/category');
    if (!token) {
        console.error('category.js empty.');
        process.exit(1);
    }
} else {
    console.error('./config/category.js not found.');
    process.exit(1);
}

let notice_channel: string = '';

client.on('ready', () => {
    // @ts-ignore
    for (const [key, value] of client.channels.cache) {
        if ((value as TextChannel).name === '一般' && value.type === 'text') {
            notice_channel = key;
            break;
        }
    }

    console.log(`${client.user!.tag} でログイン`);
});

// @ts-ignore
client.on('message', async (msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();

    const parsed = get_payload(message_text);

    if (msg.author.bot) {
        return;
    } else if (message_text === '!logout') {
        msg.channel.send("I'll be back").then();
        console.log("I'll be back");

        setTimeout(() => {
            client.destroy();
            process.exit();
        }, 2500);
    } else if (parsed.order === '!募集') {
        client.channels.fetch(category.recruit, false, true).then(recruit_channel => {

            if (!recruit_channel) {
                msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                return;
            }

            if (parsed.payload.trim() === '') {
                msg.channel.send("募集チャンネルの名前を指定してください。").then();
                return;
            }

            msg.guild!.channels.create(parsed.payload, {
                type: 'text',
                parent: category.recruit,
                permissionOverwrites: [
                    {
                        id: msg.author.id,
                        allow: ['MANAGE_CHANNELS'],
                    },
                ]
            }).then((ch: TextChannel) => {
                ch.setTopic(`作成者: ${msg.author.username}`)
                ch.createInvite().then((invite: Discord.Invite) => {
                    create_channel({
                        owner: msg.author.id,
                        owner_name: msg.author.username,
                        channel_name: parsed.payload,
                        text_channel: `${ch.id}`,
                        voice_channel: ''
                    }).then((ch_data) => {
                        msg.channel.send(`募集チャンネル「${parsed.payload}」を作成しました: https://discord.gg/${invite.code}`);
                    }).catch(console.error);
                });
            });
        });
    } else if (parsed.order === '!説明') {
        const info_text = '★忙しすぎるあなたに代わってチャンネルを作成します。\n\n' +
            '** ● 募集を立てたいとき ● **\n' +
            '> サーバー内のいずれかのテキストチャンネル内で`!募集 チャンネル名`と発言してください。\n' +
            '> 「学園掲示板A」カテゴリ内に新規テキストチャンネルが作成されます。\n' +
            '> 例）`!募集　1224 伝説の入り口(ARA2E)`\n\n' +
            '** ● 教室を立てたいとき ● **\n' +
            '> `!教室　教室名`と発言してください。\n' +
            '> 「教室棟」「教室棟VC」カテゴリにそれぞれチャンネルが作成されます。\n' +
            '> 例）`!教室 伝説の入り口（ARA2E)`\n\n' +
            '** ● キャンペーン用の教室を立てたいとき ● **\n' +
            '> `!キャンペーン　教室名`と発言してください。\n' +
            '> 「CP用教室棟」「CP用教室棟VC」カテゴリにそれぞれチャンネルが作成されます。\n' +
            '> 例）`!キャンペーン ファーストクエスト（ARA2E)`\n\n' +
            '** ● チャンネルの名前変更を行いたいとき ● **\n' +
            '> 作成されたテキストチャンネル内で、チャンネル作成を行ったユーザーが`!変更 新しい教室名`と発言してください。\n' +
            '> 例）`!変更 〆1224伝説の入り口`\n\n' +
            '** ● チャンネルの削除を行いたいとき ● **\n' +
            '> 作成されたテキストチャンネル内で、チャンネル作成を行ったユーザーが`!削除`と発言してください。\n\n' +
            '※一つのチャンネルに対する各種操作は、一定時間内に実行可能な回数に制限があります。連続で命令を行うと、最大10分後に反映されたりすることがありますのでご了承ください。\n' +
            '※チャンネルの名前については、学園のルールに準拠するようにしてください。';
        msg.channel.send(info_text)
    } else if (parsed.order === '!教室' || parsed.order === '!キャンペーン') {    // チャンネルを作成する
        let text_category = '';
        let voice_category = ''
        if (parsed.order === '!教室') {
            text_category = category.text;
            voice_category = category.voice;
        } else {
            text_category = category.text_cp
            voice_category = category.voice_cp;
        }

        const channel_name = parsed.payload;

        msg.guild!.channels.create(channel_name, {
            type: 'text',
            parent: text_category,
            permissionOverwrites: [
                {
                    id: msg.author.id,
                    allow: ['MANAGE_CHANNELS'],
                },
            ]
        }).then((text_channel_created: TextChannel) => {
            text_channel_created.setTopic(`作成者: ${msg.author.username}`)

            msg.guild!.channels.create(channel_name, {
                type: 'voice',
                parent: voice_category,
                permissionOverwrites: [
                    {
                        id: msg.author.id,
                        allow: ['MANAGE_CHANNELS'],
                    },
                ]
            }).then((voice_channel_created: VoiceChannel) => {
                voice_channel_created.setTopic(`作成者: ${msg.author.username}`)
                text_channel_created.createInvite().then((invite: Discord.Invite) => {
                    create_channel({
                        owner: msg.author.id,
                        owner_name: msg.author.username,
                        channel_name: parsed.payload,
                        text_channel: `${text_channel_created.id}`,
                        voice_channel: `${voice_channel_created.id}`
                    }).then((ch_data) => {
                        msg.channel.send(`教室「${parsed.payload}」を作成しました: https://discord.gg/${invite.code}`);
                    }).catch(console.error);
                })
            })
        })
            .catch((err: Error) => {
                console.error(err);
            });

    } else if (parsed.order === '!変更') {
        const new_title: string = parsed.payload;

        find_channel({
            owner: msg.author.id,
            text_channel: msg.channel.id,
            is_deleted: false
        }).then((channels: ChannelSource []) => {
            for (let i: number = 0; i < channels.length; i++) {
                client.channels.fetch(channels[i].text_channel, false, true).then((tc) => {
                    if (tc) {
                        // @ts-ignore
                        tc.setName(new_title, 'reason: test').then((_tc) => {
                            if (channels[i].voice_channel) {
                                client.channels.fetch(channels[i].voice_channel, false, true).then(vc => {
                                    if (vc) {
                                        // @ts-ignore
                                        vc.setName(new_title).then(() => {
                                            // @ts-ignore
                                            channels[i].update({channel_name: new_title}).then();
                                        });
                                    } else {
                                        msg.channel.send(`チャンネル名を「${new_title}」に変更しました。`);
                                    }
                                });
                            }
                        }).catch(console.error);
                    }
                });
            }
        }).catch((err: Error) => {
            console.error(err)
        });
    } else if (parsed.order === '!削除') {
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
                            }
                        });
                    }
                }).catch(console.error);
            }
        }).catch((err: Error) => {
            console.error(err)
        });
    }
});

client.login(token).then(() => {
});