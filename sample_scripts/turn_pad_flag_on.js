"use strict";
var argv = process.argv;
var find_channel = require("../models").find_channel;
// import {ChannelSource} from "../models/channel";
if (argv.length === 3) {
    var target_text_channel = argv[2];
    find_channel({
        text_channel: target_text_channel,
        // @ts-ignore
    }).then(function (channels) {
        for (var i = 0; i < channels.length; i++) {
            // @ts-ignore
            channels[i].update({
                prevent_auto_delete: 1
            }).then(function (res) {
                console.log("\"text_channel: ".concat(res.getDataValue('text_channel'), "\" ok."));
            });
        }
    }).catch(function (err) {
        console.error(err);
    });
}
else {
    console.error('"-- ${id}" required.');
}
