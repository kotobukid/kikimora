"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_date_to_delete = exports.to_channel_name_date = exports.parse_datetime = void 0;
var to_half_num = function (text) {
    var dict = {
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
    };
    return text.split('').map(function (w) {
        // @ts-ignore
        return dict[w] || w;
    }).join('');
};
var apply_regex = function (message) {
    var re = new RegExp(/(?<m>\d{2})(?<d>\d{2})?(?<message_payload>.*)/);
    var result = re.exec(message);
    if (result) {
        if (result.length === 4) {
            return {
                m: result[1],
                d: result[2] || '',
                message_payload: result[3].trim()
            };
        }
        else if (result.length === 3) {
            return {
                m: result[1],
                d: '',
                message_payload: result[2].trim()
            };
        }
    }
    return {
        m: '',
        d: '',
        message_payload: message.trim()
    };
};
var parse_datetime = function (message) {
    return apply_regex(to_half_num(message));
};
exports.parse_datetime = parse_datetime;
var to_channel_name_date = function (r) {
    if (r.m !== '') {
        if (r.d !== '') {
            return "".concat(r.m, "\u6708").concat(r.d, "\u65E5");
        }
        else {
            return "".concat(r.m, "\u6708--\u65E5");
        }
    }
    else {
        return '';
    }
};
exports.to_channel_name_date = to_channel_name_date;
var zero_pad_xx = function (x) {
    return ('0' + "".concat(x)).slice(-2);
};
var get_date_to_delete = function (r) {
    var adjusts = '';
    var today = new Date();
    var m = Number(r.m);
    var d;
    var year = today.getFullYear();
    var this_month = today.getMonth() + 1;
    if (r.d !== '') {
        d = Number(r.d);
    }
    else {
        if (!m) {
            m = this_month;
            d = today.getDate();
        }
        else {
            m = m + 1;
            d = 1;
        }
    }
    if (m < this_month) {
        year = today.getFullYear() + 1;
        adjusts += 'next year / ';
    }
    else if (m === this_month) {
        if (d < today.getDate()) {
            year = today.getFullYear() + 1;
            adjusts += 'next year / ';
        }
    }
    var target_date = new Date(year, m - 1, d + 2);
    return {
        // s: `${target_date.getFullYear()}/${zero_pad_xx(target_date.getMonth() + 1)}/${zero_pad_xx(target_date.getDate())} (${adjusts}+2 days)`,
        s: "".concat(target_date.getFullYear(), "/").concat(zero_pad_xx(target_date.getMonth() + 1), "/").concat(zero_pad_xx(target_date.getDate())),
        n: "".concat(target_date.getFullYear()).concat(zero_pad_xx(target_date.getMonth() + 1)).concat(zero_pad_xx(target_date.getDate()))
    };
};
exports.get_date_to_delete = get_date_to_delete;
