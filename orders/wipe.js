"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var lodash_1 = __importDefault(require("lodash"));
var async_1 = __importDefault(require("async"));
var func = function (client, msg) {
    msg.channel.send("<@!".concat(msg.author.id, "> \u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E2\u30FC\u30C9\u3092\u958B\u59CB\u3057\u307E\u3059\u3002"));
    (0, models_1.find_channel)({
        is_deleted: false
    }).then(function (channels) {
        var funcs = lodash_1.default.map(channels, function (ch) {
            return function (done) {
                client.channels.fetch(ch.text_channel).then(function (tc) {
                    done(null, null);
                }).catch(function (e) {
                    (0, models_1.find_channel)({
                        id: ch.id
                    }).then(function (channels_to_delete) {
                        if (channels_to_delete.length > 0) {
                            // @ts-ignore
                            channels_to_delete[0].update({ is_deleted: true }).then(function () {
                                done(null, '#' + channels_to_delete[0].channel_name);
                            });
                        }
                        else {
                            done(e, null);
                        }
                    });
                });
            };
        });
        // @ts-ignore
        async_1.default.series(funcs, function (e, results) {
            var deleted = lodash_1.default.filter(results, function (r) { return r; });
            if (deleted.length > 0) {
                msg.channel.send("<@!".concat(msg.author.id, "> \u524A\u9664\u6E08\u307F\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u72B6\u614B\u3092\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306B\u53CD\u6620\u3055\u305B\u307E\u3057\u305F\u3002\n").concat(deleted.join('\n'), "\n\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002"));
            }
            else {
                msg.channel.send("<@!".concat(msg.author.id, "> \u51E6\u7F6E\u306E\u5FC5\u8981\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E2\u30FC\u30C9\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002"));
            }
        });
    }).catch(function (err) {
        console.error(err);
    });
};
exports.default = func;
