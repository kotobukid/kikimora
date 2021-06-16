"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invite_reaction = void 0;
var functions_1 = require("../functions");
var models_1 = require("../models");
var reaction_check_information = {};
var invite_information = {};
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = functions_1.get_payload(message_text);
    models_1.find_channel({ owner: msg.author.id, is_deleted: 0 }, 10).then(function (channels) {
        if (channels.length === 0) {
            msg.channel.send('あなたの作成したチャンネルを見つけられませんでした。');
        }
        else if (channels.length === 1) {
            // 当該ユーザーが作成したチャンネルが一つしかない
            make_user_channel_accessible(msg, channels[0].text_channel, channels[0]);
        }
        else {
            // 当該ユーザーが作成したチャンネルが複数ある
            var cs_1 = channels.map(function (ch) {
                return {
                    id: ch.text_channel,
                    name: ch.channel_name
                };
            });
            var emojis_1 = [
                '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'
            ];
            var over_limit_message = channels.length > 10 ? '\n※10個め以降は省略されました' : '';
            msg.channel.send("\u62DB\u5F85\u72B6\u3092\u4F5C\u6210\u3057\u305F\u3044\u30C1\u30E3\u30F3\u30CD\u30EB\u306E\u756A\u53F7\u306B\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002" + over_limit_message + "\n(60\u79D2\u9593\u6709\u52B9)\n" + cs_1.map((function (c, index) {
                return emojis_1[index] + " <#" + c.id + ">";
            })).join('\n')).then(function (sent_message) {
                reaction_check_information[sent_message.id] = {
                    owner: msg.author.id,
                    type: 'list',
                    targets: {}
                };
                var _loop_1 = function (i) {
                    if (i < emojis_1.length) {
                        reaction_check_information[sent_message.id].targets[emojis_1[i]] = {
                            text_channel: channels[i].text_channel || '',
                            voice_channel: channels[i].voice_channel || ''
                        };
                        setTimeout(function () {
                            try {
                                sent_message.react(emojis_1[i]);
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
                for (var i = 0; i < cs_1.length; i++) {
                    var state_1 = _loop_1(i);
                    if (state_1 === "break")
                        break;
                }
                setTimeout(function () {
                    delete reaction_check_information[sent_message.id];
                    sent_message.delete();
                }, 65000);
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
var find_reaction_check_info = function (condition) {
    if (condition.message_id in reaction_check_information) {
        if (reaction_check_information[condition.message_id].owner === condition.user_id) {
            var targets = reaction_check_information[condition.message_id].targets;
            return targets[condition.emoji] || null;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
};
var find_invite_info = function (condition) {
    if (condition.message_id in invite_information) {
        return invite_information[condition.message_id];
    }
    else {
        return null;
    }
};
var make_user_channel_accessible = function (message, c_id, channel) {
    message.channel.send("\u300C<#" + c_id + ">\u300D\u306B\u53C2\u52A0\u3057\u305F\u3044\u4EBA\u306F\u2705\u3067\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n(60\u79D2\u9593\u6709\u52B9)").then(function (sent_message) {
        invite_information[sent_message.id] = {
            text_channel: channel.text_channel,
            voice_channel: channel.voice_channel
        };
        setTimeout(function () {
            delete invite_information[message.id];
            sent_message.delete();
        }, 65000);
        try {
            sent_message.react('✅');
        }
        catch (e) {
            console.error(e);
        }
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
    var target = find_reaction_check_info({
        user_id: user.id,
        message_id: reaction.message.id,
        emoji: reaction.emoji.name
    });
    if (target == null) {
        var join_target_1 = find_invite_info({ message_id: reaction.message.id });
        if (join_target_1) {
            add_user_as_channel_controller(reaction.message.guild.channels, join_target_1, user.id, function (result) {
                if (result) {
                    reaction.message.channel.send("<@!" + user.id + ">\u306B\u300C<#" + join_target_1.text_channel + ">\u300D\u3078\u306E\u5165\u5BA4\u6A29\u9650\u3092\u4ED8\u4E0E\u3057\u307E\u3057\u305F\u3002");
                }
            });
        }
        return;
    }
    models_1.find_channel({ text_channel: target.text_channel }).then(function (channels) {
        if (channels.length < 1) {
            return;
        }
        var c = reaction.message.guild.channels.resolve(channels[0].text_channel);
        if (!c) {
            console.log('channel not found 1');
            return;
        }
        make_user_channel_accessible(reaction.message, c.id, channels[0]);
    });
};
exports.invite_reaction = invite_reaction;
exports.default = func;
