"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_payload = void 0;
var get_payload = function (s) {
    var _s = s.replace(/　/ig, ' ');
    var tokens = _s.split(' ');
    var order = '';
    var payload = '';
    if (tokens.length > 1) {
        order = (tokens.shift() || '');
        payload = (tokens.join(' '));
    }
    return { order: order, payload: payload };
};
exports.get_payload = get_payload;
