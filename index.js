"use strict";
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
var discord_js_1 = __importDefault(require("discord.js"));
var process_1 = __importDefault(require("process"));
var fs_1 = __importDefault(require("fs"));
var functions_1 = require("./functions");
var models_1 = require("./models");
// @ts-ignore
var client = new discord_js_1.default.Client();
var UNDELETABLE_CHANNELS = ['一般', 'another'];
var token = '';
if (fs_1.default.existsSync('./config/secret.js')) {
    token = require('./config/secret');
    if (!token) {
        console.error('secret.js empty.');
        process_1.default.exit(1);
    }
}
else {
    console.error('./config/secret.js not found.');
    process_1.default.exit(1);
}
var category = {
    text: '',
    voice: '',
    recruit: '',
    text_cp: '',
    voice_cp: ''
};
if (fs_1.default.existsSync('./config/category.js')) {
    category = require('./config/category');
    if (!token) {
        console.error('category.js empty.');
        process_1.default.exit(1);
    }
}
else {
    console.error('./config/category.js not found.');
    process_1.default.exit(1);
}
var notice_channel = '';
client.on('ready', function () {
    // @ts-ignore
    for (var _i = 0, _a = client.channels.cache; _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value.name === '一般' && value.type === 'text') {
            notice_channel = key;
            break;
        }
    }
    console.log(client.user.tag + " \u3067\u30ED\u30B0\u30A4\u30F3");
});
// @ts-ignore
client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var message_text, parsed, info_text, text_category, voice_category_1, channel_name_1, new_title_1;
    return __generator(this, function (_a) {
        message_text = msg.content.trim();
        parsed = functions_1.get_payload(message_text);
        if (msg.author.bot) {
            return [2 /*return*/];
        }
        else if (message_text === '!logout') {
            msg.channel.send("I'll be back").then();
            console.log("I'll be back");
            setTimeout(function () {
                client.destroy();
                process_1.default.exit();
            }, 2500);
        }
        else if (parsed.order === '!募集') {
            client.channels.fetch(category.recruit, false, true).then(function (recruit_channel) {
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
                    parent: category.recruit,
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
        }
        else if (parsed.order === '!説明') {
            info_text = '★忙しすぎるあなたに代わってチャンネルを作成します。\n\n** ● 募集を立てたいとき ● **\n サーバー内のいずれかのテキストチャンネル内で`!募集 チャンネル名`と発言してください。「学園掲示板A」カテゴリ内に新規テキストチャンネルが作成されます。\n' +
                '　例）`!募集　1224 伝説の入り口(ARA2E)`\n\n' +
                '** ● 教室を立てたいとき ● **\n `!教室　教室名`と発言してください。\n「教室棟」「教室棟VC」カテゴリにそれぞれチャンネルが作成されます。\n' +
                '　例）`!教室 伝説の入り口（ARA2E)`\n\n' +
                '** ● キャンペーン用の教室を立てたいとき ● **\n `!キャンペーン　教室名`と発言してください。\n「CP用教室棟」「CP用教室棟VC」カテゴリにそれぞれチャンネルが作成されます。\n' +
                '　例）`!キャンペーン ファーストクエスト（ARA2E)`\n\n' +
                '** ● チャンネルの削除を行いたいとき ● **\n 上記手順で作成されたテキストチャンネル内で、チャンネル作成を行ったユーザーが`!削除`と発言してください。\n\n' +
                '※チャンネルの名前については、学園のルールに準拠するようにしてください。';
            msg.channel.send(info_text);
        }
        else if (parsed.order === '!教室' || parsed.order === '!キャンペーン') { // チャンネルを作成する
            text_category = '';
            voice_category_1 = '';
            if (parsed.order === '!教室') {
                text_category = category.text;
                voice_category_1 = category.voice;
            }
            else {
                text_category = category.text_cp;
                voice_category_1 = category.voice_cp;
            }
            channel_name_1 = parsed.payload;
            msg.guild.channels.create(channel_name_1, {
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
                msg.guild.channels.create(channel_name_1, {
                    type: 'voice',
                    parent: voice_category_1,
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
        }
        else if (parsed.order === '!変更') {
            new_title_1 = parsed.payload;
            models_1.find_channel({
                owner: msg.author.id,
                text_channel: msg.channel.id,
                is_deleted: false
            }).then(function (channels) {
                var _loop_1 = function (i) {
                    client.channels.fetch(channels[i].text_channel, false, true).then(function (tc) {
                        if (tc) {
                            // @ts-ignore
                            tc.setName(new_title_1, 'reason: test').then(function (_tc) {
                                client.channels.fetch(channels[i].voice_channel, false, true).then(function (vc) {
                                    if (vc) {
                                        // @ts-ignore
                                        vc.setName(new_title_1).then(function () {
                                            // @ts-ignore
                                            channels[i].update({ channel_name: new_title_1 }).then();
                                        });
                                    }
                                    else {
                                        msg.channel.send("\u30C1\u30E3\u30F3\u30CD\u30EB\u540D\u3092\u300C" + new_title_1 + "\u300D\u306B\u5909\u66F4\u3057\u307E\u3057\u305F\u3002");
                                    }
                                });
                            }).catch(console.error);
                        }
                    });
                };
                for (var i = 0; i < channels.length; i++) {
                    _loop_1(i);
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
        else if (parsed.order === '!削除') {
            models_1.find_channel({
                owner: msg.author.id,
                text_channel: msg.channel.id,
                is_deleted: false
            }).then(function (channels) {
                var _loop_2 = function (i) {
                    client.channels.fetch(channels[i].text_channel, false, true).then(function (tc) {
                        if (tc) {
                            tc.delete().then(function (tc_deleted) {
                                client.channels.fetch(channels[i].voice_channel, false, true).then(function (vc) {
                                    if (vc) {
                                        vc.delete().then(function (vc_deleted) {
                                            // @ts-ignore
                                            channels[i].update({ is_deleted: true }).then();
                                        });
                                    }
                                }).catch(console.error);
                            });
                        }
                    }).catch(console.error);
                };
                for (var i = 0; i < channels.length; i++) {
                    _loop_2(i);
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
        return [2 /*return*/];
    });
}); });
client.login(token).then(function () {
});
