"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var models_1 = __importDefault(require("../models"));
lodash_1.default.range(100).forEach(function (i) {
    var c = new models_1.default.channel();
    c.owner = '123435123' + i;
    c.owner_name = 'hagege';
    c.channel_name = '俺のチャンネル' + i;
    c.text_channel = "" + Math.floor(Math.random() * 100000000000000);
    c.voice_channel = "" + Math.floor(Math.random() * 100000000000000);
    c.is_deleted = false;
    c.save();
});
