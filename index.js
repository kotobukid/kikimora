"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importStar(require("discord.js"));
var config_1 = require("./config");
var functions_1 = require("./functions");
var recruit_1 = __importDefault(require("./orders/recruit"));
var explain_1 = __importDefault(require("./orders/explain"));
var room_1 = __importDefault(require("./orders/room"));
var change_1 = __importDefault(require("./orders/change"));
var delete_1 = __importDefault(require("./orders/delete"));
var wipe_1 = __importDefault(require("./orders/wipe"));
var close_1 = __importDefault(require("./orders/close"));
var summon_1 = __importStar(require("./orders/summon"));
var logout_1 = __importDefault(require("./orders/logout"));
var parse_datetime_1 = require("./sample_scripts/parse_datetime");
var client = new discord_js_1.default.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.once('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = [{
                        name: 'recruit',
                        description: '募集チャンネルを作成します!',
                        options: [{
                                type: "STRING",
                                name: "input",
                                description: "The input to echo back",
                                required: true
                            }],
                    }];
                // @ts-ignore
                return [4 /*yield*/, client.application.commands.set(data, '')];
            case 1:
                // @ts-ignore
                _a.sent();
                console.log("".concat(client.user.tag, " \u3067\u30ED\u30B0\u30A4\u30F3"));
                return [2 /*return*/];
        }
    });
}); });
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!interaction.isCommand()) {
            return [2 /*return*/];
        }
        console.log(interaction);
        if (interaction.commandName === 'recruit') {
            // const message = await interaction.fetchReply();
            // console.log({message});
            // check_user_has_some_role(client, interaction, (client, message) => {
            //     recruit(client, message);
            //     interaction.reply('応答');
            //     // await interaction.reply('応答');
            // });
        }
        return [2 /*return*/];
    });
}); });
client.on('messageCreate', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var message_text, parsed, dt_parsed;
    return __generator(this, function (_a) {
        message_text = msg.content.trim();
        parsed = (0, functions_1.get_payload)(message_text);
        // console.log(msg);
        if (msg.author.bot) {
            return [2 /*return*/];
        }
        else if (message_text === '!logout') {
            (0, logout_1.default)(client, msg);
        }
        else if (parsed.order === '!parse') {
            dt_parsed = (0, parse_datetime_1.parse_datetime)(msg.content.trim());
            if (dt_parsed.m) {
                msg.channel.send("\u30C1\u30E3\u30F3\u30CD\u30EB\u540D: ".concat((0, parse_datetime_1.to_channel_name)(dt_parsed), "\n\u524A\u9664\u4E88\u5B9A\u65E5: ").concat((0, parse_datetime_1.get_date_to_delete)(dt_parsed))).then();
            }
            else {
                msg.channel.send("\u65E5\u4ED8\u89E3\u91C8\u30A8\u30E9\u30FC ```!parse 1225\u30AF\u30EA\u30B9\u30DE\u30B9\u4E2D\u6B62\u306E\u304A\u77E5\u3089\u305B```\u3000\u306E\u3088\u3046\u306B\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n".concat((0, parse_datetime_1.to_channel_name)(dt_parsed))).then();
            }
        }
        else if (parsed.order === '!募集') {
            (0, functions_1.check_user_has_some_role)(client, msg, recruit_1.default);
        }
        else if (parsed.order === '!説明') {
            (0, functions_1.check_user_has_some_role)(client, msg, explain_1.default);
        }
        else if (parsed.order === '!教室' || parsed.order === '!キャンペーン') { // チャンネルを作成する
            (0, functions_1.check_user_has_some_role)(client, msg, room_1.default);
        }
        else if (parsed.order === '!変更') {
            (0, change_1.default)(client, msg);
        }
        else if (parsed.order === '!案内') {
            (0, summon_1.default)(client, msg);
        }
        else if (parsed.order === '!〆' || parsed.order === '!しめ') {
            (0, close_1.default)(client, msg);
        }
        else if (parsed.order === '!!掃除' || parsed.order === '!掃除') {
            (0, wipe_1.default)(client, msg);
        }
        else if (parsed.order === '!削除') {
            (0, delete_1.default)(client, msg);
            // } else if (parsed.order === '!情報') { // デバッグ用
            //     information(client, msg);
        }
        return [2 /*return*/];
    });
}); });
// @ts-ignore
client.on('messageReactionAdd', function (reaction, user) {
    (0, summon_1.invite_reaction)(reaction, user);
});
client.login(config_1.token).then(function () {
});
