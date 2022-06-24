"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions_1 = require("../functions");
var models_1 = require("../models");
var parse_datetime_1 = require("../sample_scripts/parse_datetime");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    var dt_parsed = (0, parse_datetime_1.parse_datetime)(parsed.payload);
    var _channel_name = dt_parsed.message_payload;
    var delete_date = (0, parse_datetime_1.get_date_to_delete)(dt_parsed);
    var channel_name = (0, functions_1.sanitize_channel_name)(_channel_name);
    var new_title = "".concat((0, parse_datetime_1.to_channel_name_date)(dt_parsed)).concat(channel_name);
    (0, models_1.find_channel)({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then(function (channels) {
        var _loop_1 = function (i) {
            var prevent_auto_delete = channels[i].prevent_auto_delete !== 0;
            client.channels.fetch(channels[i].text_channel).then(function (tc) {
                if (tc) {
                    // @ts-ignore
                    tc.setName(new_title, "reason: kikimora order from ".concat(msg.author.username)).then(function (_tc) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then(function (vc) {
                                if (vc) {
                                    // vcがあるので教室/キャンペーンチャンネル
                                    // @ts-ignore
                                    vc.setName(new_title).then(function () {
                                        // @ts-ignore
                                        channels[i].update({
                                            channel_name: new_title,
                                            deleted_at: delete_date.n
                                            // @ts-ignore
                                        }).then().catch(function (e) {
                                            console.error(e);
                                        });
                                        msg.channel.send("<@!".concat(msg.author.id, "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#").concat(channels[i].text_channel, ">")).then(function () {
                                            if (!prevent_auto_delete) {
                                                if (delete_date.n !== '') {
                                                    // @ts-ignore
                                                    tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306F".concat(delete_date.s, "\u306B\u524A\u9664\u4E88\u5B9A\u3067\u3059\u3002")).then();
                                                }
                                                else {
                                                    // @ts-ignore
                                                    tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u306F\u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002").then();
                                                }
                                            }
                                            else {
                                                // @ts-ignore
                                                tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306F\u81EA\u52D5\u524A\u9664\u5BFE\u8C61\u5916\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002").then();
                                            }
                                        });
                                    });
                                }
                                else {
                                    // vcのIDは記録されているがサーバーからは見つけられない(手動削除済みなど)
                                    msg.channel.send("<@!".concat(msg.author.id, "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#").concat(channels[i].text_channel, ">")).then(function () {
                                        if (!prevent_auto_delete) {
                                            if (delete_date.n !== '') {
                                                // @ts-ignore
                                                tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306F".concat(delete_date.s, "\u306B\u524A\u9664\u4E88\u5B9A\u3067\u3059\u3002")).then();
                                            }
                                            else {
                                                // @ts-ignore
                                                tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u306F\u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002").then();
                                            }
                                        }
                                        else {
                                            // @ts-ignore
                                            tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306F\u81EA\u52D5\u524A\u9664\u5BFE\u8C61\u5916\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002").then();
                                        }
                                    });
                                }
                            }).catch(function (e) {
                                console.error(e);
                                msg.channel.send("<@!".concat(msg.author.id, "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#").concat(channels[i].text_channel, ">\n\u30DC\u30A4\u30B9\u30C1\u30E3\u30F3\u30CD\u30EB\u3092\u307F\u3064\u3051\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002")).then(function () {
                                    if (delete_date.n !== '') {
                                        // @ts-ignore
                                        tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306F".concat(delete_date.s, "\u306B\u524A\u9664\u4E88\u5B9A\u3067\u3059\u3002")).then();
                                    }
                                    else {
                                        // @ts-ignore
                                        tc.send("\u3053\u306E\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u306F\u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002").then();
                                    }
                                }).catch(function (e) {
                                    console.log(e);
                                });
                            });
                        }
                        else {
                            // voice_channelがない場合(==募集チャンネル)
                            // @ts-ignore
                            channels[i].update({
                                channel_name: new_title,
                                deleted_at: delete_date.n
                                // @ts-ignore
                            }).then().catch(function (e) {
                                console.error(e);
                            });
                            msg.channel.send("<@!".concat(msg.author.id, "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002<#").concat(channels[i].text_channel, ">")).then(function () {
                                if (delete_date.n !== '') {
                                    // @ts-ignore
                                    tc.send("\u3053\u306E\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u306F".concat(delete_date.s, "\u306B\u524A\u9664\u4E88\u5B9A\u3067\u3059\u3002")).then();
                                }
                                else {
                                    // @ts-ignore
                                    tc.send("\u3053\u306E\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u306F\u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002").then();
                                }
                            });
                        }
                    }).catch(function (e) {
                        console.error(e);
                        msg.channel.send("<@!".concat(msg.author.id, "> \u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002"));
                    });
                }
                else {
                    // DB上にはチャンネルの情報があるがサーバーからは見つからない(手動削除済みなど)
                    console.log('not found1');
                }
            }).catch(function (e) {
                // DB上にはチャンネルの情報があるがサーバーからは見つからない(手動削除済みなど)
                console.log('not found2');
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
