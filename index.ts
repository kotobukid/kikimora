import Discord, {Message, TextChannel} from 'discord.js';
import {token} from "./config";
import {get_payload} from './functions'
import recruit from './orders/recruit';
import explain from './orders/explain';
import room from './orders/room';
import change from './orders/change';
import wipe from './orders/wipe';
import logout from './orders/logout';

// @ts-ignore
const client: Discord.Client & { channels: { cache: Record<string, any> } } = new Discord.Client();

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
        logout(client, msg);
    } else if (parsed.order === '!募集') {
        recruit(client, msg);
    } else if (parsed.order === '!説明') {
        explain(client, msg);
    } else if (parsed.order === '!教室' || parsed.order === '!キャンペーン') {    // チャンネルを作成する
        room(client, msg);
    } else if (parsed.order === '!変更') {
        change(client, msg);
    } else if (parsed.order === '!削除') {
        wipe(client, msg);
    }
});

client.login(token).then(() => {
});