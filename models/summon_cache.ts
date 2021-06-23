import {Sequelize, Model, DataTypes} from 'sequelize';
import db from "./index";

declare type SummonCache = {
    id: number,
    message: string,
    react_id: string,
    text: string,
    voice: string,
    expires_at: string,
    owner: string,
}

const ModelSource = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    react_id: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    voice: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    expires_at: {
        type: new DataTypes.STRING(12),
        allowNull: true,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

const table_name: string = 'summon_cache'

export {ModelSource, table_name, SummonCache}