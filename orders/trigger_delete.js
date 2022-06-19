"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_channels_expired = exports.warn_channels_to_delete = void 0;
var discord_js_1 = require("discord.js");
var models_1 = require("../models");
var lodash_1 = __importDefault(require("lodash"));
var async_1 = __importDefault(require("async"));
var warn_channels_to_delete = function (client, threshold_date) {
    (0, models_1.find_channel_expired_on_date)(threshold_date).then(function (channels) {
        var funcs = lodash_1.default.map(channels, function (ch) {
            return function (done) {
                client.channels.fetch(ch.text_channel).then(function (tc) {
                    if (tc && tc instanceof discord_js_1.TextChannel) {
                        tc.send("<@!".concat(ch.owner, "> \u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u65E5\u304C\u8FD1\u4ED8\u3044\u3066\u3044\u307E\u3059\u3002\u524A\u9664\u4E88\u5B9A\u3092\u5EF6\u671F\u3059\u308B\u5834\u5408\u306F `!\u5909\u66F4` \u30B3\u30DE\u30F3\u30C9\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u4E88\u5B9A\u65E5\u3092\u542B\u3080\u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002")).then(function () {
                            done();
                        });
                    }
                });
            };
        });
        async_1.default.series(funcs, function () {
        });
    });
};
exports.warn_channels_to_delete = warn_channels_to_delete;
var delete_channels_expired = function (client) {
    console.log('"delete_channels_expired" is kicked.');
    (0, models_1.find_channel_expired)().then(function (channels) {
        if (channels.length > 0) {
            console.log("".concat(channels.length, " channel(s) found."));
        }
        var _loop_1 = function (i) {
            client.channels.fetch(channels[i].text_channel).then(function (tc) {
                if (tc) {
                    tc.delete().then(function (tc_deleted) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then(function (vc) {
                                if (vc) {
                                    vc.delete().then(function (vc_deleted) {
                                        // @ts-ignore
                                        channels[i].update({ is_deleted: true }).then();
                                    });
                                }
                                else {
                                    // @ts-ignore
                                    channels[i].update({ is_deleted: true }).then();
                                }
                            }).catch(function () {
                                // @ts-ignore
                                channels[i].update({ is_deleted: true }).then();
                            });
                        }
                        else {
                            // @ts-ignore
                            channels[i].update({ is_deleted: true }).then();
                        }
                    });
                }
            }).catch(console.error);
        };
        for (var i = 0; i < channels.length; i++) {
            _loop_1(i);
        }
    }).catch(function (err) {
        console.error(err);
    });
};
exports.delete_channels_expired = delete_channels_expired;
var func = function (client, msg) {
    (0, exports.delete_channels_expired)(client);
};
exports.default = func;
