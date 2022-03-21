import Discord, {Message} from "discord.js";

const get_payload = (s: string) => {
    const _s: string = s.replace(/　/ig, ' ');
    const tokens = _s.split(' ');
    let order: string = '';
    let payload: string = '';

    if (tokens.length > 1) {
        order = (tokens.shift() || '');
        payload = (tokens.join(' '));
    } else {
        order = (tokens.shift() || '');
        payload = '';
    }

    return {order, payload};
};

const check_user_has_some_role = (client: Discord.Client & { channels: { cache: Record<string, any> } }, msg: Message, next: Function): void => {
    let not_everyone_role_found: boolean = false;
    // @ts-ignore
    msg.member.roles.cache.each((value) => {
        if (value.name !== '@everyone') {
            not_everyone_role_found = true;
        }
    });

    if (not_everyone_role_found) {
        next(client, msg);
    } else {
        // do nothing
        console.error('user has no role(@everyone only)');
        msg.channel.send("エラー: この機能を使用するにはいずれかの役職に就いている必要があります。").then();
    }
};

function clone_dict<T>(source: T):T {
    return {...source};
}

function clone_flat_map<T>(source: T[]): T[] {
    console.log(source)
    // permissionOverwritesは結局配列的な存在っぽい
    // @ts-ignore
    return source.concat([])
}

const date_to_string = (d: Date) => {
    return `${d.getFullYear()}${('0' + (d.getMonth() + 1)).slice(-2)}${('0' + d.getDate()).slice(-2)}`
}

const sanitize_channel_name = (name: string): string => {
    return name.replace(/\[/g, '［')
        .replace(/\]/g, '］')
        .replace(/\(/g, '（')
        .replace(/\)/g, '）');
}

export {
    clone_flat_map,
    clone_dict,
    get_payload,
    check_user_has_some_role,
    date_to_string,
    sanitize_channel_name
}