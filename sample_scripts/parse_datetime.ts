import {ParsedMessage} from "../types";

const to_half_num = (text: string): string => {
    const dict = {
        '０': '0',
        '１': '1',
        '２': '2',
        '３': '3',
        '４': '4',
        '５': '5',
        '６': '6',
        '７': '7',
        '８': '8',
        '９': '9',
    }

    return text.split('').map((w: string) => {
        // @ts-ignore
        return dict[w] || w;
    }).join('');
};


const apply_regex = (message: string): ParsedMessage => {
    let re = new RegExp(/(?<m>\d{2})(?<d>\d{2})?(?<message_payload>.*)/)

    let result: RegExpExecArray | null = re.exec(message);

    if (result) {
        if (result.length === 4) {
            return {
                m: result[1],
                d: result[2] || '',
                message_payload: result[3].trim()
            }
        } else if (result.length === 3) {
            return {
                m: result[1],
                d: '',
                message_payload: result[2].trim()
            }
        }
    }

    return {
        m: '',
        d: '',
        message_payload: message.trim()
    }
};

const parse_datetime = (message: string): ParsedMessage => {
    return apply_regex(to_half_num(message));
}

const to_channel_name_date = (r: ParsedMessage): string => {
    if (r.m !== '') {
        if (r.d !== '') {
            return `${r.m}月${r.d}日`;
        } else {
            return `${r.m}月`;
        }
    } else {
        return '';
    }
}

const zero_pad_xx = (x: number | string): string => {
    return ('0' + `${x}`).slice(-2);
};

const get_coming_date = (r: ParsedMessage, offset_days: number): {s: string, n: string} => {
    let adjusts: string = '';
    const today = new Date();

    if (offset_days == undefined) {
        offset_days = 0;
    }

    let m: number = Number(r.m);
    let d!: number;

    let year: number = today.getFullYear();
    const this_month: number = today.getMonth() + 1;

    if (r.d !== '') {
        d = Number(r.d);
    } else {
        if (!m) {
            m = this_month;
            d = today.getDate();
        } else {
            m = m + 1;
            d = 1;
        }
    }

    if (m < this_month) {
        year = today.getFullYear() + 1;
        adjusts += 'next year / '
    } else if (m === this_month) {
        if (d + offset_days < today.getDate()) {
            year = today.getFullYear() + 1;
            adjusts += 'next year / '
        }
    }

    const target_date = new Date(year, m - 1, d + offset_days);

    return {
        s: `${target_date.getFullYear()}/${zero_pad_xx(target_date.getMonth() + 1)}/${zero_pad_xx(target_date.getDate())}`,
        n: `${target_date.getFullYear()}${zero_pad_xx(target_date.getMonth() + 1)}${zero_pad_xx(target_date.getDate())}`
    };
}


const get_date_to_delete = (r: ParsedMessage): {s: string, n: string} => {
    return get_coming_date(r, 3);
}

const get_tomorrow = (r: ParsedMessage): {s: string, n: string} => {
    return get_coming_date(r, 1);
}

const get_today_pm = (): ParsedMessage => {
    const today = new Date();
    return {
        m: `${today.getMonth() + 1}`,
        d: `${today.getDate()}`,
        message_payload: ''
    }
}

export {
    parse_datetime,
    to_channel_name_date,
    get_date_to_delete,
    get_tomorrow,
    get_today_pm
}