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
    message: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    text_channel: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    voice_channel: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: true,
    },
    expires: {
        type: new sequelize_1.DataTypes.STRING(12),
        allowNull: true,
    },
};
exports.ModelSource = ModelSource;
var table_name = 'message_room';
exports.table_name = table_name;
