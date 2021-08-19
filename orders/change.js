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
                    tc.setName(new_title, "reason: kikimora order from " + msg.author.username).then(function (_tc) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(function (vc) {
                                if (vc) {
                                    // @ts-ignore
                                    vc.setName(new_title).then(function () {
                                        // @ts-ignore
                                        channels[i].update({ channel_name: new_title }).then().catch(function (e) {
                                            console.error(e);
                                        });
                                        msg.channel.send("<@!" + msg.author.id + "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#" + channels[i].text_channel + ">");
                                    });
                                }
                                else {
                                    msg.channel.send("<@!" + msg.author.id + "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#" + channels[i].text_channel + ">");
                                }
                            }).catch(function (e) {
                                console.error(e);
                                msg.channel.send("<@!" + msg.author.id + "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#" + channels[i].text_channel + ">\n\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u307F\u3064\u3051\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
                            });
                        }
                        else {
                            msg.channel.send("<@!" + msg.author.id + "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#" + channels[i].text_channel + ">");
                        }
                    }).catch(function (e) {
                        console.error(e);
                        msg.channel.send("<@!" + msg.author.id + "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
                    });
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
