"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invite_reaction = void 0;
var functions_1 = require("../functions");
var models_1 = require("../models");
var async_1 = __importDefault(require("async"));
var lodash_1 = __importDefault(require("lodash"));
var reaction_check_information = {};
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = functions_1.get_payload(message_text);
    models_1.find_channel({ owner: msg.author.id, is_deleted: 0 }, 10, true).then(function (channels) {
        if (channels.length === 0) {
            msg.channel.send('あなたの作成したチャンネルを見つけられませんでした。');
        }
        else if (channels.length === 1) {
            //     // 当該ユーザーが作成したチャンネルが一つしかない
            msg.channel.send("\u300C<#" + channels[0].text_channel + ">\u300D\u306B\u53C2\u52A0\u3057\u305F\u3044\u4EBA\u306F\u2705\u3067\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n(30\u65E5\u9593\u6709\u52B9)").then(function (sent_message) {
                models_1.create_message_room({
                    message: sent_message.id,
                    text_channel: channels[0].text_channel,
                    voice_channel: channels[0].voice_channel || '',
                }, function () {
                    try {
                        sent_message.react('✅');
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
            }).catch(console.error);
        }
        else {
            // 当該ユーザーが作成したチャンネルが複数ある
            var async_funcs = channels.map(function (ch) {
                return function (done) {
                    // @ts-ignore
                    client.channels.fetch(ch.text_channel, false, true).then(function (text_channel) {
                        if (text_channel) {
                            if (text_channel.parentID) {
                                // @ts-ignore
                                client.channels.fetch(text_channel.parentID).then(function (category) {
                                    done(null, {
                                        text_name: text_channel.name,
                                        text_id: ch.text_channel,
                                        voice_id: ch.voice_channel || '',
                                        category_name: category.name,
                                    });
                                });
                            }
                            else {
                                // カテゴリーに所属していないチャンネル
                                done(null, {
                                    text_name: text_channel.name,
                                    text_id: ch.text_channel,
                                    voice_id: ch.voice_channel || '',
                                    category_name: '',
                                });
                            }
                        }
                        else {
                            done(null, null);
                        }
                    }).catch(function (e) {
                        done(null, null); // エラーはここでは無視
                    });
                };
            });
            // @ts-ignore
            async_1.default.series(async_funcs, function (err, _cs) {
                if (err) {
                    throw err;
                }
                var emojis = [
                    '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'
                ];
                var over_limit_message = channels.length > 10 ? '\n※10個め以降は省略されました' : '';
                var reactions = {};
                var cs = lodash_1.default.filter(_cs, function (__cs) {
                    return !!__cs;
                });
                var mapping = lodash_1.default.filter(_cs.map((function (c, index) {
                    if (!!c) {
                        reactions[emojis[index]] = { text: c.text_id, voice: c.voice_id, category_name: c.category_name };
                        return emojis[index] + " " + c.category_name + " <#" + c.text_id + ">";
                    }
                    else {
                        return '';
                    }
                }))).join('\n');
                msg.channel.send("<@!" + msg.author.id + "> \u62DB\u5F85\u72B6\u3092\u4F5C\u6210\u3057\u305F\u3044\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u756A\u53F7\u306B\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002" + over_limit_message + "\n(30\u65E5\u9593\u6709\u52B9)\n" + mapping).then(function (sent_message) {
                    models_1.create_summon_cache({
                        owner: msg.author.id,
                        reactions: reactions,
                        message: sent_message.id
                    }, function () {
                        var _loop_1 = function (i) {
                            if (i < emojis.length) {
                                setTimeout(function () {
                                    try {
                                        sent_message.react(emojis[i]);
                                    }
                                    catch (e) {
                                        console.error(e);
                                    }
                                }, (1 + i) * 16);
                            }
                            else {
                                return "break";
                            }
                        };
                        for (var i = 0; i < cs.length; i++) {
                            var state_1 = _loop_1(i);
                            if (state_1 === "break")
                                break;
                        }
                    });
                });
            });
        }
    });
};
var add_user_as_channel_controller = function (channels, room_info, user_id, next) {
    var t_c = channels.resolve(room_info.text_channel);
    if (t_c == null) {
        next(false);
    }
    else {
        // @ts-ignore
        var permissionOverwrites_v = functions_1.clone_flat_map(t_c.permissionOverwrites);
        permissionOverwrites_v.set("" + user_id, {
            id: user_id,
            // @ts-ignore
            allow: ['VIEW_CHANNEL'],
        });
        // @ts-ignore
        t_c.overwritePermissions(permissionOverwrites_v);
        var v_c = channels.resolve(room_info.voice_channel);
        if (v_c == null) {
            next(true);
        }
        else {
            // @ts-ignore
            var permissionOverwrites_v_1 = functions_1.clone_flat_map(v_c.permissionOverwrites);
            permissionOverwrites_v_1.set("" + user_id, {
                id: user_id,
                // @ts-ignore
                allow: ['VIEW_CHANNEL'],
            });
            // @ts-ignore
            v_c.overwritePermissions(permissionOverwrites_v_1);
            next(true);
        }
    }
};
var suggest_invite = function (message, sc, channel) {
    message.delete().then(function (message_deleted) {
        message.channel.send("\u300C<#" + sc.text + ">\u300D\u306B\u53C2\u52A0\u3057\u305F\u3044\u4EBA\u306F\u2705\u3067\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n(30\u65E5\u9593\u6709\u52B9)").then(function (sent_message) {
            models_1.create_message_room({
                message: sent_message.id,
                text_channel: sc.text,
                voice_channel: sc.voice
            }, function () {
                try {
                    sent_message.react('✅');
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    });
};
var invite_reaction = function (reaction, user) {
    if (user.bot) {
        return;
    }
    if (!'' + reaction.message.id in reaction_check_information) {
        // 無関係なリアクション
        // console.log('無関係なリアクション')
        return;
    }
    models_1.fetch_summon_target({
        message: reaction.message.id,
        react: reaction.emoji.name,
        owner: user.id
    }).then(function (sc) {
        var c = reaction.message.guild.channels.resolve(sc.text);
        if (!c) {
            console.log('channel not found 1');
            return;
        }
        suggest_invite(reaction.message, sc);
    }).catch(function () {
        // ☑が押された時
        models_1.fetch_message_room(reaction.message.id, function (mr) {
            if (mr) {
                add_user_as_channel_controller(reaction.message.guild.channels, {
                    text_channel: mr.text_channel,
                    voice_channel: mr.voice_channel
                }, user.id, function (result) {
                    if (result) {
                        reaction.message.channel.send("<@!" + user.id + "> \u306B\u300C<#" + mr.text_channel + ">\u300D\u3078\u306E\u5165\u5BA4\u6A29\u9650\u3092\u4ED8\u4E0E\u3057\u307E\u3057\u305F\u3002");
                    }
                });
            }
        });
    });
};
exports.invite_reaction = invite_reaction;
exports.default = func;
