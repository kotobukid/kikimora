import Discord, {CollectorFilter, Message, TextChannel, Intents} from 'discord.js';
import {token} from "./config";
import {check_user_has_some_role, get_payload} from './functions'
import recruit from './orders/recruit';
import explain from './orders/explain';
import room from './orders/room';
import change from './orders/change';
import _delete from './orders/delete';
import wipe from './orders/wipe';
import close from './orders/close';
import summon, {invite_reaction} from './orders/summon';
import logout from './orders/logout';
import information from './orders/information';
import _ from 'lodash';
import {find_channel} from "./models";
import {ChannelSource} from "./models/channel";

// @ts-ignore
const client: Discord.Client & { channels: { cache: Record<string, any> } } = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

// let notice_channel: string = '';

client.on('ready', () => {
    // @ts-ignore
    // for (const [key, value] of client.channels.cache) {
    //     if ((value as TextChannel).name === '一般' && value.type === 'text') {
    //         notice_channel = key;
    //         break;
    //     }
    // }

    console.log(`${client.user!.tag} でログイン`);
});


// @ts-ignore
client.on('messageCreate', async (msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();

    const parsed = get_payload(message_text);
    // console.log(msg);
    if (msg.author.bot) {
        return;
        // } else if (message_text === '!logout') {
        //     logout(client, msg);
    } else if (parsed.order === '!募集') {
        check_user_has_some_role(client, msg, recruit);
    } else if (parsed.order === '!説明') {
        check_user_has_some_role(client, msg, explain);
    } else if (parsed.order === '!教室' || parsed.order === '!キャンペーン') {    // チャンネルを作成する
        check_user_has_some_role(client, msg, room);
    } else if (parsed.order === '!変更') {
        change(client, msg);
    } else if (parsed.order === '!案内') {
        summon(client, msg);
    } else if (parsed.order === '!〆' || parsed.order === '!しめ') {
        close(client, msg);
    } else if (parsed.order === '!!掃除' || parsed.order === '!掃除') {
        wipe(client, msg);
    } else if (parsed.order === '!削除') {
        _delete(client, msg);
    // } else if (parsed.order === '!情報') { // デバッグ用
    //     information(client, msg);
    }
});


// @ts-ignore
client.on('messageReactionAdd', (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
    invite_reaction(reaction, user);
});

client.login(token).then(() => {
});