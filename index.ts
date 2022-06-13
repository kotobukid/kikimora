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
import {parse_datetime, to_channel_name, get_date_to_delete} from "./sample_scripts/parse_datetime";

// @ts-ignore
const client: Discord.Client & { channels: { cache: Record<string, any> } } = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

// let notice_channel: string = '';


client.once('ready', async () => {
    const data = [{
        name: 'recruit',
        description: '募集チャンネルを作成します!',
         options: [{
            type: "STRING",
            name: "input",
            description: "The input to echo back",
            required: true
        }],
    }];
    // @ts-ignore
    await client.application.commands.set(data, '');
    console.log(`${client.user!.tag} でログイン`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    console.log(interaction);

    if (interaction.commandName === 'recruit') {
        // const message = await interaction.fetchReply();
        // console.log({message});
        // check_user_has_some_role(client, interaction, (client, message) => {
        //     recruit(client, message);
        //     interaction.reply('応答');
        //     // await interaction.reply('応答');
        // });
    }
});

// @ts-ignore
client.on('messageCreate', async (msg: Message & { channel: { name: string } }) => {
    const message_text = msg.content.trim();

    const parsed = get_payload(message_text);
    // console.log(msg);
    if (msg.author.bot) {
        return;
    } else if (message_text === '!logout') {
        logout(client, msg);
    } else if (parsed.order === '!parse') {
        const dt_parsed = parse_datetime(msg.content.trim());
        if (dt_parsed.m) {
            msg.channel.send(`チャンネル名: ${to_channel_name(dt_parsed)}\n削除予定日: ${get_date_to_delete(dt_parsed)}`).then();
        } else {
            msg.channel.send(`日付解釈エラー \`\`\`!parse 1225クリスマス中止のお知らせ\`\`\`　のように入力してください\n${to_channel_name(dt_parsed)}`).then();
        }
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