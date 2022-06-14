import {DataTypes} from 'sequelize';

declare type ChannelSource = {
    owner: string,
    owner_name: string,
    channel_name: string,
    text_channel: string,
    voice_channel: string
}

declare type Channel = {
    id: number,
    is_deleted: boolean
} & ChannelSource

const ModelSource = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    channel_name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    text_channel: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    voice_channel: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false
    }
};

const table_name: string = 'channel'

export {ModelSource, table_name, ChannelSource, Channel}