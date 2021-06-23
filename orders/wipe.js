"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var lodash_1 = __importDefault(require("lodash"));
var func = function (client, msg) {
    models_1.find_channel({
        owner: msg.author.id,
        is_deleted: false
    }).then(function (channels) {
        var _loop_1 = function (i) {
            var ch = channels[i];
            client.channels.fetch(channels[i].text_channel, false, true).then(function (tc) {
            }).catch(function (e) {
                models_1.find_channel({
                    id: ch.id
                }).then(function (channels_to_delete) {
                    lodash_1.default.each(channels_to_delete, function (ch_d) {
                        // @ts-ignore
                        ch_d.update({ is_deleted: true }).then();
                        console.log("\u524A\u9664\u6E08\u307F\u30C1\u30E3\u30F3\u30CD\u30EB:" + ch_d.channel_name + " \u306E\u72B6\u614B\u3092\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306B\u53CD\u6620\u3055\u305B\u307E\u3057\u305F\u3002");
                    });
                });
            });
        };
        for (var i = 0; i < channels.length; i++) {
            _loop_1(i);
        }
    }).catch(function (err) {
        console.error(err);
    });
};
exports.default = func;
