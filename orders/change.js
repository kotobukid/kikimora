"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions_1 = require("../functions");
var models_1 = require("../models");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = functions_1.get_payload(message_text);
    var new_title = parsed.payload;
    models_1.find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then(function (channels) {
        var _loop_1 = function (i) {
            client.channels.fetch(channels[i].text_channel, false, true).then(function (tc) {
                if (tc) {
                    // @ts-ignore
                    tc.setName(new_title, 'reason: test').then(function (_tc) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(function (vc) {
                                if (vc) {
                                    // @ts-ignore
                                    vc.setName(new_title).then(function () {
                                        // @ts-ignore
                                        channels[i].update({ channel_name: new_title }).then();
                                    });
                                }
                                else {
                                    msg.channel.send("\u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u300C" + new_title + "\u300D\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\u3002");
                                }
                            });
                        }
                    }).catch(console.error);
                }
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
