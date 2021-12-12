"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var models_1 = require("../models");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    var channel_name = (0, functions_1.sanitize_channel_name)(parsed.payload);
    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }
    // @ts-ignore
    var everyoneRole = msg.guild.roles.cache.get(msg.guild.id);
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
    client.channels.fetch(text_category_id, { allowUnknownGuild: true }).then(function (text_category) {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }
        // @ts-ignore
        var permissionOverwrites = (0, functions_1.clone_flat_map)(text_category.permissionOverwrites);
        permissionOverwrites.set("".concat(msg.author.id), {
            id: msg.author.id,
            // @ts-ignore
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
        });
        permissionOverwrites.set(everyoneRole.id, {
            id: everyoneRole.id,
            // @ts-ignore
            deny: ['VIEW_CHANNEL'],
        });
        msg.guild.channels.create(channel_name, {
            type: 'text',
            parent: text_category_id,
            // @ts-ignore
            permissionOverwrites: permissionOverwrites,
            topic: "\u4F5C\u6210\u8005: ".concat(msg.author.username)
        }).then(function (text_channel_created) {
            client.channels.fetch(voice_category_id, { allowUnknownGuild: true }).then(function (voice_category) {
                if (!voice_category) {
                    msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
                    return;
                }
                // @ts-ignore
                var permissionOverwrites_v = (0, functions_1.clone_flat_map)(voice_category.permissionOverwrites);
                permissionOverwrites_v.set("".concat(msg.author.id), {
                    id: msg.author.id,
                    // @ts-ignore
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
                });
                permissionOverwrites_v.set(everyoneRole.id, {
                    id: everyoneRole.id,
                    // @ts-ignore
                    deny: ['VIEW_CHANNEL'],
                });
                msg.guild.channels.create(channel_name, {
                    type: 'voice',
                    parent: voice_category_id,
                    // @ts-ignore
                    permissionOverwrites: permissionOverwrites_v,
                    topic: "\u4F5C\u6210\u8005: ".concat(msg.author.username)
                }).then(function (voice_channel_created) {
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
        }).catch(function (err) {
            console.error(err);
        });
    });
};
exports.default = func;
