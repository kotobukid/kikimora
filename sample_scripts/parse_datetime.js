"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to_channel_name = exports.parse_datetime = void 0;
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
var to_channel_name = function (r) {
    if (r.m !== '') {
        if (r.d !== '') {
            return "".concat(r.m, "\u6708").concat(r.d, "\u65E5 ").concat(r.message_payload);
        }
        else {
            return "".concat(r.m, "\u6708 ").concat(r.message_payload);
        }
    }
    else {
        return r.message_payload;
    }
};
exports.to_channel_name = to_channel_name;
