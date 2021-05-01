"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var func = function (client, msg) {
    models_1.find_channel({
        owner: msg.author.id,
        text_channel: msg.channel.id,
        is_deleted: false
    }).then(function (channels) {
        var _loop_1 = function (i) {
            client.channels.fetch(channels[i].text_channel, false, true).then(function (tc) {
                if (tc) {
                    tc.delete().then(function (tc_deleted) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel, false, true).then(function (vc) {
                                if (vc) {
                                    vc.delete().then(function (vc_deleted) {
                                        // @ts-ignore
                                        channels[i].update({ is_deleted: true }).then();
                                    });
                                }
                            }).catch(console.error);
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
exports.default = func;
