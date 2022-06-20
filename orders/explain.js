"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var func = function (client, msg) {
    var info_text = '★忙しすぎるあなたに代わって教室を作成します。\n\n' +
        '** ● 新ルール 日付4文字 ● **\n' +
        '> 各種教室の管理コスト削減のため、放置チャンネルの自動削除機能が導入されます。\n' +
        '> 以下の説明に[日付4文字]という言葉が登場する場合、それは `1月1日 => 0101`, `1231 => 12月31日` のような、月+日の指定を意味します。\n' +
        '> この日付指定を行った場合、指定の日付+2日目にチャンネルが自動削除されます。\n' +
        '> この日付指定を行わなかった場合、チャンネル作成当日を指定したことになり、2日後にチャンネルが自動削除されます。\n' +
        '> `01` のように2桁の数値のみで指定した場合、それは月の指定とみなされ、削除予定日は翌月1日+2日目となります。日が決定し次第、速やかに`!変更`コマンドで月日の指定を行ってください。\n' +
        '> 月または日で1桁の数値を指定する場合、01のように頭に0を付与してそれぞれ2桁となるようにしてください。\n\n' +
        '** ● 募集を立てたいとき ● **\n' +
        '> サーバー内のいずれかのテキストチャンネル内で`!募集 [日付4文字]教室名`と発言してください。\n' +
        '> 「学園掲示板A」カテゴリ内に新規の教室が作成されます。\n' +
        '> 例）`!募集　1201ARA2E-伝説の入り口`\n\n' +
        '** ● 教室を立てたいとき ● **\n' +
        '> `!教室　[日付4文字]教室名`と発言してください。\n' +
        '> 「教室棟」「教室棟VC」カテゴリにそれぞれ教室が作成されます。\n' +
        '> 例）`!教室 0401-SW2.5-蛮族を駆逐せよ`\n\n' +
        '** ● キャンペーン用の教室を立てたいとき ● **\n' +
        '> `!キャンペーン　[日付4文字]教室名`と発言してください。\n' +
        '> 「CP用教室棟」「CP用教室棟VC」カテゴリにそれぞれ新規の教室が作成されます。\n' +
        '> 例）`!キャンペーン 0209-シノビガミ-カムイ伝`\n\n' +
        '** ● 教室名を変更したいとき ● **\n' +
        '> 作成された教室(テキスト)内で、教室作成を行ったユーザーが`!変更 [日付4文字]新しい教室名`と発言してください。\n' +
        '> 例）`!変更 1224-ARA2E-伝説の入り口`\n\n' +
        '** ● 教室名の頭に「〆」をつけたいとき または外したいとき● **\n' +
        '> 作成された教室(テキスト)内で、教室作成を行ったユーザーが `!〆` または `!しめ` と発言してください（発言するたびに「〆」が着脱されます。連続実行時の制限に注意）。\n' +
        '> 例）`!〆`\n\n' +
        '** ● 教室の削除を行いたいとき ● **\n' +
        '> 作成された教室(テキスト)内で、教室作成を行ったユーザーが`!削除`と発言してください。\n\n' +
        '** ● 作成した教室に他のユーザーを誘いたいとき ● **\n' +
        '> `!案内`と発言してください。\n' +
        '> あなたの作成した教室の一覧を提示します。誘いたい教室の番号でリアクションしてください。教室が一つしか存在しない場合、このステップは省略されます。\n' +
        '> 続いて表示されるメッセージに従ってください。\n\n' +
        '※一つの教室に対する各種操作は、一定時間内に実行可能な回数に制限があります。連続で命令を行うと、最大10分後まで反映されないといったことがありますのでご注意ください。\n' +
        '※教室の名前については、学園のルールに準拠するようにしてください。';
    msg.author.send(info_text).then().catch(function (e) {
        if (e instanceof discord_js_1.DiscordAPIError) {
            msg.channel.send(info_text);
        }
    });
    msg.react('✅').then();
};
exports.default = func;
