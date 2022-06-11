"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var functions_1 = require("../functions");
var func = function (client, msg) {
    var message_text = msg.content.trim();
    var parsed = (0, functions_1.get_payload)(message_text);
    var channel_name = (0, functions_1.sanitize_channel_name)(parsed.payload);
    if (channel_name.trim() === '') {
        msg.channel.send("教室名を指定してください。").then();
        return;
    }
    // @ts-ignore
    var everyoneRole = msg.guild.roles.cache.get(msg.guild.id);
    var text_category_id = '';
    var voice_category_id = '';
    if (parsed.order === '!教室') {
        text_category_id = config_1.category.text;
        voice_category_id = config_1.category.voice;
    }
    else {
        // キャンペーン
        text_category_id = config_1.category.text_cp;
        voice_category_id = config_1.category.voice_cp;
    }
    // @ts-ignore
    client.channels.fetch(text_category_id).then(function (text_category) {
        if (!text_category) {
            msg.channel.send("テキストチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
            return;
        }
        //
        //
        // text_category.permissionOverwrites.create(everyoneRole.id, {VIEW_CHANNEL: true}).then((p: PermissionOverwrites) => {
        //     console.log({p});
        // })
        return;
        // // @ts-ignore
        // const permissionOverwrites: Map<string, PermissionOverwrites> = clone_dict(text_category.permissionOverwrites);
        // console.log(permissionOverwrites)
        // // const permissionOverwrites: any[] = [];
        //
        // permissionOverwrites.push({
        //     id: msg.author.id,
        //     // @ts-ignore
        //     allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
        // });
        // permissionOverwrites.push({
        //     id: everyoneRole!.id,
        //     // @ts-ignore
        //     deny: ['VIEW_CHANNEL'],
        // });
        //
        // msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'text' }>{
        //     type: 'text',
        //     parent: text_category_id,
        //     // @ts-ignore
        //     permissionOverwrites: permissionOverwrites,
        //     topic: `作成者: ${msg.author.username}`
        //     // @ts-ignore
        // }).then((text_channel_created: TextChannel) => {
        //
        //     client.channels.fetch(voice_category_id).then(voice_category => {
        //         if (!voice_category) {
        //             msg.channel.send("ボイスチャンネルカテゴリの特定に失敗しました。botの管理者に連絡してください。").then();
        //             return;
        //         }
        //
        //         // @ts-ignore
        //         // const permissionOverwrites_v: Map<string, PermissionOverwrites> = clone_flat_map(voice_category.permissionOverwrites);
        //         const permissionOverwrites_v: any[] = [];
        //
        //         permissionOverwrites_v.push({
        //             id: msg.author.id,
        //             // @ts-ignore
        //             allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
        //         });
        //         permissionOverwrites_v.push({
        //             id: everyoneRole!.id,
        //             // @ts-ignore
        //             deny: ['VIEW_CHANNEL'],
        //         });
        //
        //         msg.guild!.channels.create(channel_name, <GuildChannelCreateOptions & { type: 'voice' }>{
        //             type: 'voice',
        //             parent: voice_category_id,
        //             // @ts-ignore
        //             permissionOverwrites: permissionOverwrites_v,
        //             topic: `作成者: ${msg.author.username}`
        //             // @ts-ignore
        //         }).then((voice_channel_created: VoiceChannel) => {
        //
        //             create_channel({
        //                 owner: msg.author.id,
        //                 owner_name: msg.author.username,
        //                 channel_name: parsed.payload,
        //                 text_channel: `${text_channel_created.id}`,
        //                 voice_channel: `${voice_channel_created.id}`
        //             }).then((ch_data) => {
        //                 msg.channel.send(`教室「<#${text_channel_created.id}>」を作成しました。`);
        //             }).catch(console.error);
        //         })
        //     });
        // }).catch((err: Error) => {
        //     console.error(err);
        // });
    });
};
exports.default = func;
