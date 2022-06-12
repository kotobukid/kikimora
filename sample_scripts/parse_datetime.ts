declare type ParsedMessage = {m: string, d: string, message_payload: string}

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

const parse_datetime= (message: string): ParsedMessage => {
    return apply_regex(to_half_num(message));
}

export {
    parse_datetime
}