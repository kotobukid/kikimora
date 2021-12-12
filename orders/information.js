"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    client.channels.fetch(config_1.category.recruit, { allowUnknownGuild: true }).then(function (recruit_category) {
        // @ts-ignore
        console.log(msg);
        // @ts-ignore
        var everyoneRole = msg.guild.roles.cache.get(msg.guild.id);
        console.log(everyoneRole);
    });
};
exports.default = func;
