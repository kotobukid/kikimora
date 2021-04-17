"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var models_1 = require("../models");
lodash_1.default.range(10).forEach(function (i) {
    models_1.create_channel({
        owner: '123435123' + i,
        owner_name: 'hagege',
        channel_name: '俺のチャンネル' + i,
        text_channel: "" + Math.floor(Math.random() * 100000000000000),
        voice_channel: "" + Math.floor(Math.random() * 100000000000000)
    }).then(function (ch) {
        console.log(ch);
    });
});
