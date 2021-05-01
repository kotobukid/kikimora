"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var func = function (client, msg) {
    msg.channel.send("I'll be back").then();
    console.log("I'll be back");
    setTimeout(function () {
        client.destroy();
        process_1.default.exit();
    }, 2500);
};
exports.default = func;
