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
    react_id: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
    },
    text: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    voice: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: true,
    },
    expires_at: {
        type: new sequelize_1.DataTypes.STRING(12),
        allowNull: true,
    },
    owner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
};
exports.ModelSource = ModelSource;
var table_name = 'summon_cache';
exports.table_name = table_name;
