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

export {
    get_payload,
    check_user_has_some_role
}