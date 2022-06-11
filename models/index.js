'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch_message_room = exports.create_message_room = exports.fetch_summon_target = exports.create_summon_cache = exports.find_channel = exports.create_channel = void 0;
var functions_1 = require("../functions");
var fs = require('fs');
var path = require('path');
var sequelize_1 = __importDefault(require("sequelize"));
// @ts-ignore
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};
var sequelize;
if (config.use_env_variable) {
    sequelize = new sequelize_1.default.Sequelize(config);
}
else {
    sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, config);
}
fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(function (file) {
    // @ts-ignore
    var _model = require(path.join(__dirname, file));
    db[_model.table_name] = sequelize.define(_model.table_name, _model.ModelSource);
});
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
var create_channel = function (source) {
    return new Promise(function (resolve, reject) {
        var c = new db.channel();
        c.owner = source.owner;
        c.owner_name = source.owner_name;
        c.channel_name = source.channel_name;
        c.text_channel = source.text_channel;
        c.voice_channel = source.voice_channel;
        c.is_deleted = false;
        resolve(c.save());
    });
};
exports.create_channel = create_channel;
var find_channel = function (condition, limit, reverse) {
    if (!limit) {
        limit = null;
    }
    var order = [];
    if (reverse) {
        order = [['id', 'DESC']];
    }
    return new Promise(function (resolve, reject) {
        db.channel.findAll({
            where: condition,
            limit: limit,
            order: order
        }).then(function (data) {
            resolve(data);
        });
    });
};
exports.find_channel = find_channel;
var create_summon_cache = function (info, next) {
    var today = new Date();
    today.setDate(today.getDate() + 30);
    var expires = (0, functions_1.date_to_string)(today);
    for (var r in info.reactions) {
        var cache = new db.summon_cache();
        cache.message = info.message;
        cache.owner = info.owner;
        cache.react_id = r;
        cache.text = info.reactions[r].text;
        cache.voice = info.reactions[r].voice;
        cache.expires_at = expires;
        cache.save();
    }
    next();
};
exports.create_summon_cache = create_summon_cache;
var fetch_summon_target = function (info) {
    return new Promise(function (resolve, reject) {
        var _a;
        var _expires = new Date();
        var expires = (0, functions_1.date_to_string)(_expires);
        db.summon_cache.findOne({
            where: {
                message: info.message,
                react_id: info.react,
                owner: info.owner,
                expires_at: (_a = {},
                    _a[sequelize_1.default.Op.gte] = expires,
                    _a)
            },
        }).then(function (data) {
            if (data) {
                resolve(data);
            }
            else {
                reject();
            }
        });
    });
};
exports.fetch_summon_target = fetch_summon_target;
var create_message_room = function (source, next) {
    var today = new Date();
    today.setDate(today.getDate() + 30);
    var expires = (0, functions_1.date_to_string)(today);
    var mr = new db.message_room();
    mr.message = source.message;
    mr.text_channel = source.text_channel;
    mr.voice_channel = source.voice_channel;
    mr.expires = expires;
    mr.save();
    next();
};
exports.create_message_room = create_message_room;
var fetch_message_room = function (message, next) {
    var _a;
    var _expires = new Date();
    var expires = (0, functions_1.date_to_string)(_expires);
    db.message_room.findOne({
        where: {
            message: message,
            expires: (_a = {},
                _a[sequelize_1.default.Op.gte] = expires,
                _a)
        },
    }).then(function (data) {
        next(data);
    });
};
exports.fetch_message_room = fetch_message_room;
db.Sequelize = sequelize_1.default;
exports.default = db;
