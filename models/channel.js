"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table_name = exports.ModelSource = void 0;
var sequelize_1 = require("sequelize");
var ModelSource = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    owner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    owner_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    channel_name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    text_channel: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    voice_channel: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        default: false
    },
    deleted_at: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    prevent_auto_delete: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        default: 0
    }
};
exports.ModelSource = ModelSource;
var table_name = 'channel';
exports.table_name = table_name;
