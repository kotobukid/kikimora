import Discord, {Channel, Message, TextChannel} from 'discord.js';
import process from 'process';
import fs from 'fs';
import _ from 'lodash';

// @ts-ignore
const client: Discord.Client & {channels: {cache: any[]}} = new Discord.Client();
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
    voice: ''
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
    if (msg.author.bot) {
        return;
    } else if (msg.content === '!ping') {
        msg.channel.send('Pong!').then();
    } else if (msg.content === '!logout') {
        msg.channel.send("I'll be back").then();
        console.log("I'll be back");

        setTimeout(() => {
            client.destroy();
            process.exit();
        }, 2500);
    } else if (msg.content.startsWith('mkch')) {    // チャンネルを作成する

        const texts = msg.content.replace(/　/ig, ' ');
        const _channel_name = texts.split(' ')
        if (_channel_name.length > 1) {
            const channel_name = _channel_name[1]

            msg.guild!.channels.create(channel_name, {
                type: 'text',
                parent: category.text
            }).then(() => {
                msg.guild!.channels.create(channel_name, {
                    type: 'voice',
                    parent: category.voice
                })
            })
                .catch((err: Error) => {
                    console.log(err);
                });
        }
    } else if (msg.content === 'delch') {
        const name: string = msg.channel.name;

        // @ts-ignore
        for (const [key, value] of client.channels.cache) {
            if ((value as TextChannel).name === name) {
                if (_.includes(UNDELETABLE_CHANNELS, name)) {
                    break;
                }
                if ((value.type === 'text') || (value.type === 'voice')) {
                    value.delete().then()
                }
            }
        }
    }
});

client.login(token).then(() => {
});