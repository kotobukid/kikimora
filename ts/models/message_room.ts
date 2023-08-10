import {Sequelize, Model, DataTypes} from 'sequelize';
import db from "./index";

declare type MessageRoom = {
    id: number,
    message: string,
    text_channel: string,
    voice_channel: string,
    expires: string,
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
    text_channel: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    voice_channel: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    expires: {
        type: new DataTypes.STRING(12),
        allowNull: true,
    },
};

const table_name: string = 'message_room'

export {ModelSource, table_name, MessageRoom}