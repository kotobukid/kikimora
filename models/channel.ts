import {Sequelize, Model, DataTypes} from 'sequelize';

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
        allowNull: false,
    },
    voice_channel: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false
    },
    created_at: {
        type: new DataTypes.DATE
    }
};

const table_name: string = 'channel'

export {ModelSource, table_name}