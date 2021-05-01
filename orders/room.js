"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var models_1 = require("../models");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = functions_1.get_payload(message_text);
    var text_category = '';
    var voice_category = '';
    if (parsed.order === '!教室') {
        text_category = config_1.category.text;
        voice_category = config_1.category.voice;
    }
    else {
        text_category = config_1.category.text_cp;
        voice_category = config_1.category.voice_cp;
    }
    var channel_name = parsed.payload;
    msg.guild.channels.create(channel_name, {
        type: 'text',
        parent: text_category,
        permissionOverwrites: [
            {
                id: msg.author.id,
                allow: ['MANAGE_CHANNELS'],
            },
        ]
    }).then(function (text_channel_created) {
        text_channel_created.setTopic("\u4F5C\u6210\u8005: " + msg.author.username);
        msg.guild.channels.create(channel_name, {
            type: 'voice',
            parent: voice_category,
            permissionOverwrites: [
                {
                    id: msg.author.id,
                    allow: ['MANAGE_CHANNELS'],
                },
            ]
        }).then(function (voice_channel_created) {
            voice_channel_created.setTopic("\u4F5C\u6210\u8005: " + msg.author.username);
            text_channel_created.createInvite().then(function (invite) {
                models_1.create_channel({
                    owner: msg.author.id,
                    owner_name: msg.author.username,
                    channel_name: parsed.payload,
                    text_channel: "" + text_channel_created.id,
                    voice_channel: "" + voice_channel_created.id
                }).then(function (ch_data) {
                    msg.channel.send("\u6559\u5BA4\u300C" + parsed.payload + "\u300D\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F: https://discord.gg/" + invite.code);
                }).catch(console.error);
            });
        });
    })
        .catch(function (err) {
        console.error(err);
    });
};
exports.default = func;
