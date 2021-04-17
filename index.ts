import Discord, {Channel, Message, TextChannel, VoiceChannel} from 'discord.js';
import process from 'process';
import fs from 'fs';
import _ from 'lodash';
import {get_payload} from './functions'
import {create_channel, find_channel} from "./models"
import {ChannelSource} from "./models/channel";

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
    recruit: ''
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

        const recruit_channel = client.channels.cache.get(category.recruit);

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
            parent: category.recruit
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
    } else if (parsed.order === '!教室') {    // チャンネルを作成する

        const channel_name = parsed.payload;

        msg.guild!.channels.create(channel_name, {
            type: 'text',
            parent: category.text
        }).then((text_channel_created: TextChannel) => {
            text_channel_created.setTopic(`作成者: ${msg.author.username}`)

            msg.guild!.channels.create(channel_name, {
                type: 'voice',
                parent: category.voice
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

    } else if (parsed.order === '!削除') {
        // const name: string = msg.channel.name;

        find_channel({
            owner: msg.author.id,
            text_channel: msg.channel.id,
            is_deleted: false
        }).then((channels: ChannelSource []) => {
            for (let i: number = 0; i < channels.length; i++) {
                const tc = client.channels.cache.get(channels[i].text_channel);
                if (tc) {
                    tc.delete().then((tc_deleted: Channel) => {
                        const vc = client.channels.cache.get(channels[i].voice_channel);
                        if (vc) {
                            vc.delete().then((vc_deleted: Channel) => {
                                console.log(channels[i])
                                // @ts-ignore
                                channels[i].update({is_deleted: true}).then();
                            });
                        }
                    });
                }
            }
        }).catch((err: Error) => {
            console.error(err)
        });
    }
});

client.login(token).then(() => {
});