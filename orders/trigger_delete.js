"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_channels_expired = void 0;
var models_1 = require("../models");
var delete_channels_expired = function (client) {
    console.log('"delete_channels_expired" is kicked.');
    // @ts-ignore
    (0, models_1.find_channel_expired)().then(function (channels) {
        if (channels.length > 0) {
            console.log("".concat(channels.length, " channel(s) found."));
        }
        var _loop_1 = function (i) {
            client.channels.fetch(channels[i].text_channel).then(function (tc) {
                if (tc) {
                    tc.delete().then(function (tc_deleted) {
                        if (channels[i].voice_channel) {
                            client.channels.fetch(channels[i].voice_channel).then(function (vc) {
                                if (vc) {
                                    vc.delete().then(function (vc_deleted) {
                                        // @ts-ignore
                                        channels[i].update({ is_deleted: true }).then();
                                    });
                                }
                                else {
                                    // @ts-ignore
                                    channels[i].update({ is_deleted: true }).then();
                                }
                            }).catch(function () {
                                // @ts-ignore
                                channels[i].update({ is_deleted: true }).then();
                            });
                        }
                        else {
                            // @ts-ignore
                            channels[i].update({ is_deleted: true }).then();
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
exports.delete_channels_expired = delete_channels_expired;
var func = function (client, msg) {
    (0, exports.delete_channels_expired)(client);
};
exports.default = func;
