import Discord, {Message, Intents, CacheType, Interaction} from 'discord.js';
import {token} from "./config_loader";
import {check_user_has_some_role, get_orders} from './functions'
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
import {
    parse_datetime,
    to_channel_name_date,
    get_date_to_delete,
    get_tomorrow,
    get_today_pm
} from "./sample_scripts/parse_datetime";
import {delete_channels_expired, warn_channels_to_delete} from "./orders/trigger_delete";
import {OrderSet, ParsedMessage} from "./types";
import Timeout = NodeJS.Timeout;
import fs from 'fs';
import path from 'path';

const client: Discord.Client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

const generate_today_string = (days_offset?: number): string => {
    let parsed_dt!: ParsedMessage;
    const today: Date = new Date();

    if (days_offset == undefined) {
        parsed_dt = {
            m: `${today.getMonth() + 1}`,
            d: `${today.getDate()}`,
            message_payload: ''
        };
    } else {
        const target_day: Date = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() + days_offset}`);
        parsed_dt = {
            m: `${target_day.getMonth() + 1}`,
            d: `${target_day.getDate()}`,
            message_payload: ''
        };
    }
    return get_date_to_delete(parsed_dt).n; // (+3 days)
};

client.once('ready', async (): Promise<void> => {
    // const data = [{
    //     name: 'recruit',
    //     description: '募集チャンネルを作成します!',
    //     options: [{
    //         type: "STRING",
    //         name: "input",
    //         description: "The input to echo back",
    //         required: true
    //     }],
    // }];
    // // @ts-ignore
    // await client.application.commands.set(data, '');
    console.log(`${client.user!.tag} でログイン`);

    const filename: string = path.join(__dirname, 'db/last_checked.txt');

    let last_checked: string = '';
    if (fs.existsSync(filename)) {
        last_checked = fs.readFileSync(filename).toString();
    }

    const today_pm: ParsedMessage = get_today_pm();

    const today_string: string = generate_today_string();

    delete_channels_expired(client);    // 起動直後に自動削除

    // const tomorrow_string = generate_today_string(1);
    const tomorrow_string: { s: string, n: string } = get_tomorrow(today_pm);

    if (last_checked !== today_string) {
        // 本日初めての警告
        warn_channels_to_delete(client, tomorrow_string.n);
        fs.writeFile(filename, today_string, (): void => {
        });
    }
    console.log({last_checked})

    const outer: Timeout = setInterval((): void => {  // 30分毎に日付が変わっていないかを確認
        const now_string: string = generate_today_string();
        console.log({now_string})
        if (now_string !== today_string) {  // 日付の変更が確認できてからは24時間に1回の自動削除を行う

            clearInterval(outer);

            const every_day_process = (): void => {
                delete_channels_expired(client);

                const today_pm: ParsedMessage = get_today_pm();
                const today_string_inner: string = generate_today_string();
                console.log(`every day process ${today_string_inner}`)

                const tomorrow_string: { s: string, n: string } = get_tomorrow(today_pm);
                warn_channels_to_delete(client, tomorrow_string.n);

                fs.writeFile(filename, today_string_inner, (): void => {
                });
            }

            every_day_process();

            setInterval(every_day_process, 1000 * 60 * 60 * 24);
        }
    }, 1000 * 60 * 30);
});

// client.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
//     if (!interaction.isCommand()) {
//         return;
//     }
//
//     console.log(interaction);
//
//     // if (interaction.commandName === 'recruit') {
//         // const message = await interaction.fetchReply();
//         // console.log({message});
//         // check_user_has_some_role(client, interaction, (client, message) => {
//         //     recruit(client, message);
//         //     interaction.reply('応答');
//         //     // await interaction.reply('応答');
//         // });
//     // }
// });

client.on('messageCreate', async (msg: Message): Promise<void> => {

    const {order, payload}: OrderSet = get_orders(msg);
    // console.log(msg);
    if (msg.author.bot) {
        return;
    } else if (payload === '!logout') {
        // logout(client, msg);
    } else if (order === '!parse') {
        const dt_parsed: ParsedMessage = parse_datetime(msg.content.trim());
        if (dt_parsed.m) {
            msg.channel.send(`チャンネル名: ${to_channel_name_date(dt_parsed)}\n削除予定日: ${get_date_to_delete(dt_parsed).s}`).then();
        } else {
            msg.channel.send(`日付解釈エラー \`\`\`!parse 1225クリスマス中止のお知らせ\`\`\`　のように入力してください\n${to_channel_name_date(dt_parsed)}`).then();
        }
    } else if (order === '!募集') {
        check_user_has_some_role(client, msg, recruit);
    } else if (order === '!説明') {
        check_user_has_some_role(client, msg, explain);
    } else if (order === '!教室' || order === '!キャンペーン') {    // チャンネルを作成する
        check_user_has_some_role(client, msg, room);
    } else if (order === '!変更') {
        change(client, msg);
    } else if (order === '!案内') {
        summon(client, msg);
    } else if (order === '!〆' || order === '!しめ') {
        close(client, msg);
    } else if (order === '!掃除') {
        wipe(client, msg);
        // } else if (order === '!自動削除') {  // ほぼデバッグ用
        //     trigger_delete(client, msg);
    } else if (order === '!削除') {
        _delete(client, msg);
        // } else if (order === '!情報') { // デバッグ用
        //     information(client, msg);
    }
});

// @ts-ignore
client.on('messageReactionAdd', (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser): void => {
    invite_reaction(reaction, user);
});

client.login(token).then((): void => {
});