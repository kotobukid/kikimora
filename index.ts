import Discord, {Message, Intents, CacheType, Interaction} from 'discord.js';
import {token} from "./config";
import {check_user_has_some_role, get_payload} from './functions'
import recruit from './orders/recruit';
import explain from './orders/explain';
import room from './orders/room';
import change from './orders/change';
import _delete from './orders/delete';
import wipe from './orders/wipe';
import close from './orders/close';
import trigger_delete from "./orders/trigger_delete";
import summon, {invite_reaction} from './orders/summon';
import logout from './orders/logout';
import {parse_datetime, to_channel_name_date, get_date_to_delete} from "./sample_scripts/parse_datetime";
import {delete_channels_expired} from "./orders/trigger_delete";
import {ParsedMessage} from "./types";
import Timeout = NodeJS.Timeout;

const client: Discord.Client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

const generate_today_string = (): string => {
    const today = new Date();
    const parsed_dt: ParsedMessage = {
        m: `${today.getMonth() + 1}`,
        d: `${today.getDate()}`,
        message_payload: ''
    };
    return get_date_to_delete(parsed_dt).n;
};

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

    const today_string = generate_today_string();

    delete_channels_expired(client);    // 起動直後に自動削除

    const outer: Timeout = setInterval(() => {  // 30分毎に日付が変わっていないかを確認
        const now_string = generate_today_string();
        if (now_string !== today_string) {  // 日付の変更が確認できてからは24時間に1回の自動削除を行う

            clearTimeout(outer);

            setInterval(() => {
                delete_channels_expired(client);
            }, 1000 * 60 * 60 * 24);
        }
    }, 1000 * 60 * 30);
});

client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
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

client.on('messageCreate', async (msg: Message) => {
    const message_text = msg.content.trim();

    const parsed = get_payload(message_text);
    // console.log(msg);
    if (msg.author.bot) {
        return;
    } else if (message_text === '!logout') {
        // logout(client, msg);
    } else if (parsed.order === '!parse') {
        const dt_parsed = parse_datetime(msg.content.trim());
        if (dt_parsed.m) {
            msg.channel.send(`チャンネル名: ${to_channel_name_date(dt_parsed)}\n削除予定日: ${get_date_to_delete(dt_parsed).s}`).then();
        } else {
            msg.channel.send(`日付解釈エラー \`\`\`!parse 1225クリスマス中止のお知らせ\`\`\`　のように入力してください\n${to_channel_name_date(dt_parsed)}`).then();
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
    } else if (parsed.order === '!自動削除') {  // ほぼデバッグ用
        trigger_delete(client, msg);
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