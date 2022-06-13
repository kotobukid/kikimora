"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var models_1 = require("../models");
var async_1 = __importDefault(require("async"));
var lodash_1 = __importDefault(require("lodash"));
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    var channel_name = (0, functions_1.sanitize_channel_name)(parsed.payload);
    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }
    var everyoneRole = msg.guild.roles.everyone;
    var text_category_id = '';
    var voice_category_id = '';
    if (parsed.order === '!教室') {
        text_category_id = config_1.category.text;
        voice_category_id = config_1.category.voice;
    }
    else {
        // キャンペーン
        text_category_id = config_1.category.text_cp;
        voice_category_id = config_1.category.voice_cp;
    }
    // @ts-ignore
    client.channels.fetch(text_category_id).then(function (text_category) {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }
        var permissionSettings = [
            {
                id: everyoneRole.id,
                VIEW_CHANNEL: true,
            },
            {
                id: msg.author.id,
                MANAGE_CHANNELS: true
            }
        ];
        msg.guild.channels.create(channel_name, {
            type: 0 /* GUILD_TEXT */,
            parent: text_category_id,
            topic: "\u4F5C\u6210\u8005: ".concat(msg.author.username)
            // @ts-ignore
        }).then(function (text_channel_created) {
            text_channel_created.lockPermissions()
                .then(function () {
                async_1.default.series(lodash_1.default.map(permissionSettings, function (p) {
                    return (function (done) {
                        var id = p.id;
                        var pop = (0, functions_1.omit_id)(p);
                        // @ts-ignore
                        text_channel_created.permissionOverwrites.create(id, pop).then(function (_ch, err) {
                            done(err);
                        });
                    });
                }), function () {
                    client.channels.fetch(voice_category_id).then(function (voice_category) {
                        if (!voice_category) {
                            msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                            return;
                        }
                        var permissionOverwrites_v = [
                            {
                                id: everyoneRole.id,
                                VIEW_CHANNEL: false,
                            },
                            {
                                id: msg.author.id,
                                MANAGE_CHANNELS: true,
                                VIEW_CHANNEL: true
                            }
                        ];
                        msg.guild.channels.create(channel_name, {
                            type: 2 /* GUILD_VOICE */,
                            parent: voice_category_id,
                            topic: "\u4F5C\u6210\u8005: ".concat(msg.author.username)
                            // @ts-ignore
                        }).then(function (voice_channel_created) {
                            voice_channel_created.lockPermissions()
                                .then(function () {
                                async_1.default.series(lodash_1.default.map(permissionOverwrites_v, function (p) {
                                    return (function (done) {
                                        var id = p.id;
                                        var pop = (0, functions_1.omit_id)(p);
                                        // @ts-ignore
                                        voice_channel_created.permissionOverwrites.create(id, pop).then(function (_ch, err) {
                                            done(err);
                                        });
                                    });
                                }), function () {
                                    (0, models_1.create_channel)({
                                        owner: msg.author.id,
                                        owner_name: msg.author.username,
                                        channel_name: parsed.payload,
                                        text_channel: "".concat(text_channel_created.id),
                                        voice_channel: "".concat(voice_channel_created.id)
                                    }).then(function (ch_data) {
                                        msg.channel.send("\u6559\u5BA4\u300C<#".concat(text_channel_created.id, ">\u300D\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F\u3002"));
                                    }).catch(console.error);
                                });
                            });
                        });
                    });
                });
            });
        }).catch(function (err) {
            console.error(err);
        });
    });
};
exports.default = func;
