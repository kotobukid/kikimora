"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var models_1 = require("../models");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = functions_1.get_payload(message_text);
    client.channels.fetch(config_1.category.recruit, false, true).then(function (recruit_channel) {
        if (!recruit_channel) {
            msg.channel.send("募集用カテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }
        if (parsed.payload.trim() === '') {
            msg.channel.send("募集チャンネルの名前を指定してください。").then();
            return;
        }
        msg.guild.channels.create(parsed.payload, {
            type: 'text',
            parent: config_1.category.recruit,
            permissionOverwrites: [
                {
                    id: msg.author.id,
                    allow: ['MANAGE_CHANNELS'],
                },
            ]
        }).then(function (ch) {
            ch.setTopic("\u4F5C\u6210\u8005: " + msg.author.username);
            ch.createInvite().then(function (invite) {
                models_1.create_channel({
                    owner: msg.author.id,
                    owner_name: msg.author.username,
                    channel_name: parsed.payload,
                    text_channel: "" + ch.id,
                    voice_channel: ''
                }).then(function (ch_data) {
                    msg.channel.send("\u52DF\u96C6\u30C1\u30E3\u30F3\u30CD\u30EB\u300C" + parsed.payload + "\u300D\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F: https://discord.gg/" + invite.code);
                }).catch(console.error);
            });
        });
    });
};
exports.default = func;
