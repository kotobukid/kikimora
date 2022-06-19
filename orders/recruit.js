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
var parse_datetime_1 = require("../sample_scripts/parse_datetime");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    var dt_parsed = (0, parse_datetime_1.parse_datetime)(parsed.payload);
    var _channel_name = dt_parsed.message_payload;
    var delete_date = (0, parse_datetime_1.get_date_to_delete)(dt_parsed);
    var channel_name = (0, functions_1.sanitize_channel_name)(_channel_name);
    channel_name = "".concat((0, parse_datetime_1.to_channel_name_date)(dt_parsed)).concat(channel_name);
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
            type: 0 /* GUILD_TEXT */,
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
                            voice_channel: '',
                            deleted_at: delete_date.n,
                            prevent_auto_delete: 0
                        }).then(function (ch_data) {
                            msg.channel.send("\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u300C<#".concat(ch.id, ">\u300D\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F\u3002")).then();
                            if (delete_date.n !== '') {
                                ch.send("\u3053\u306E\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u306F".concat(delete_date.s, "\u306B\u524A\u9664\u4E88\u5B9A\u3067\u3059\u3002")).then();
                            }
                            else {
                                ch.send("\u3053\u306E\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u306B\u306F\u81EA\u52D5\u524A\u9664\u4E88\u5B9A\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002").then();
                            }
                        }).catch(console.error);
                    });
                });
            })
                .catch(console.error);
        });
    });
};
exports.default = func;
