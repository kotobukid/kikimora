'use strict';

const fs = require('fs');
const path = require('path');
import Sequelize from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db: Record<string, any> = {};
import {ChannelSource} from "./channel"

let sequelize: Sequelize.Sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize.Sequelize(config);
} else {
    sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: string) => {
        const _model = require(path.join(__dirname, file))
        db[_model.table_name] = sequelize.define(_model.table_name, _model.ModelSource);
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


const create_channel = (source: ChannelSource): Promise<any> => {
    return new Promise((resolve, reject) => {

        const c = new db.channel!()
        c.owner = source.owner
        c.owner_name = source.owner_name
        c.channel_name = source.channel_name
        c.text_channel = source.text_channel
        c.voice_channel = source.voice_channel
        c.is_deleted = false
        resolve(c.save())
    })
}

const find_channel = (condition: Record<string, any>, limit?: number | null): Promise<any> => {
    if (!limit) {
        limit = null;
    }

    return new Promise((resolve, reject) => {
        db.channel.findAll({
            where: condition,
            limit
        }).then((data: any[]) => {
            resolve(data)
        })
    })
}

db.Sequelize = Sequelize;
export default db;
export {create_channel, find_channel}