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
    // @ts-ignore
    client.channels.fetch(config_1.category.recruit, false, true).then(function (recruit_category) {
        if (!recruit_category) {
            msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }
        if (parsed.payload.trim() === '') {
            msg.channel.send("募集チャンネルの名前を指定してください。").then();
            return;
        }
        var channel_name = (0, functions_1.sanitize_channel_name)(parsed.payload);
        var everyoneRole = msg.guild.roles.everyone;
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
            type: 'text',
            parent: config_1.category.recruit,
            topic: "\u4F5C\u6210\u8005: ".concat(msg.author.username)
            // @ts-ignore
        }).then(function (ch) {
            ch.lockPermissions()
                .then(function () {
                async_1.default.series(lodash_1.default.map(permissionSettings, function (p) {
                    return (function (done) {
                        var id = p.id;
                        var pop = (0, functions_1.omit_id)(p);
                        // @ts-ignore
                        ch.permissionOverwrites.create(id, pop).then(function (_ch, err) {
                            done(err);
                        });
                    });
                }), function () {
                    ch.createInvite({ maxAge: 86400 * 7 }).then(function (invite) {
                        (0, models_1.create_channel)({
                            owner: msg.author.id,
                            owner_name: msg.author.username,
                            channel_name: channel_name,
                            text_channel: "".concat(ch.id),
                            voice_channel: ''
                        }).then(function (ch_data) {
                            msg.channel.send("\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u300C<#".concat(ch.id, ">\u300D\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F\u3002")).then();
                        }).catch(console.error);
                    });
                });
            })
                .catch(console.error);
        });
    });
};
exports.default = func;
