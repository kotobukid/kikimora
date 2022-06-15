"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit_id = exports.sanitize_channel_name = exports.date_to_string = exports.check_user_has_some_role = exports.get_payload = exports.clone_dict = exports.clone_flat_map = void 0;
var lodash_1 = __importDefault(require("lodash"));
var get_payload = function (s) {
    var _s = s.replace(/　/ig, ' ');
    var tokens = _s.split(' ');
    var order = '';
    var payload = '';
    if (tokens.length > 1) {
        order = (tokens.shift() || '');
        payload = (tokens.join(' '));
    }
    else {
        order = (tokens.shift() || '');
        payload = '';
    }
    return { order: order, payload: payload };
};
exports.get_payload = get_payload;
var check_user_has_some_role = function (client, msg, next) {
    var not_everyone_role_found = false;
    // @ts-ignore
    msg.member.roles.cache.each(function (value) {
        if (value.name !== '@everyone') {
            not_everyone_role_found = true;
        }
    });
    if (not_everyone_role_found) {
        next(client, msg);
    }
    else {
        // do nothing
        console.error('user has no role(@everyone only)');
        msg.channel.send("エラー: この機能を使用するにはいずれかの役職に就いている必要があります。").then();
    }
};
exports.check_user_has_some_role = check_user_has_some_role;
function clone_dict(source) {
    return __assign({}, source);
}
exports.clone_dict = clone_dict;
function clone_flat_map(source) {
    console.log(source);
    // permissionOverwritesは結局配列的な存在っぽい
    // @ts-ignore
    return source.concat([]);
}
exports.clone_flat_map = clone_flat_map;
var date_to_string = function (d) {
    return "".concat(d.getFullYear()).concat(('0' + (d.getMonth() + 1)).slice(-2)).concat(('0' + d.getDate()).slice(-2));
};
exports.date_to_string = date_to_string;
var sanitize_channel_name = function (name) {
    return name.replace(/\[/g, '［')
        .replace(/\]/g, '］')
        .replace(/\(/g, '（')
        .replace(/\)/g, '）');
};
exports.sanitize_channel_name = sanitize_channel_name;
var omit_id = function (o) {
    var next = {};
    var keys = Object.keys(o);
    lodash_1.default.each(keys, function (key) {
        if (key !== 'id') {
            next[key] = o[key];
        }
    });
    return next;
};
exports.omit_id = omit_id;
