'use strict';

import {date_to_string} from "../functions";

const fs = require('fs');
const path = require('path');
import Sequelize, {Op} from "sequelize";

// @ts-ignore
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db: Record<string, any> = {};
import {ChannelSource} from "./channel"
import {SummonCache} from "./summon_cache"
import {MessageRoom} from "./message_room";

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
        // @ts-ignore
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
        c.deleted_at = source.deleted_at || ''
        c.is_deleted = false
        resolve(c.save())
    })
}

const find_channel = (condition: Record<string, any>, limit?: number | null, reverse?: boolean | null): Promise<any> => {
    if (!limit) {
        limit = null;
    }

    let order: [string, string][] | [][] = [];
    if (reverse) {
        order = [['id', 'DESC']]
    }

    return new Promise((resolve, reject) => {
        db.channel.findAll({
            where: condition,
            limit,
            order
        }).then((data: any[]) => {
            resolve(data)
        })
    })
}

const zero_pad_xx = (x: number | string): string => {
    return ('0' + `${x}`).slice(-2);
};

const find_channel_expired_on_date = (target_day: string): Promise<ChannelSource[]> => {
    return new Promise((resolve, reject) => {

        db.channel.findAll({
            where: {
                deleted_at: {
                    [Op.lte]: target_day,
                    [Op.not]: ''
                },
                is_deleted: {
                    [Op.not]: 1
                }
            }
        }).then((data: ChannelSource[]) => {
            resolve(data);
        });
    });
}

const find_channel_expired = (): Promise<ChannelSource[]> => {
    return new Promise((resolve, reject) => {
        const today = new Date();
        const today_string = `${today.getFullYear()}${zero_pad_xx(today.getMonth() + 1)}${zero_pad_xx(today.getDate())}`

        db.channel.findAll({
            where: {
                deleted_at: {
                    [Op.lte]: today_string,
                    [Op.not]: ''
                },
                is_deleted: {
                    [Op.not]: 1
                }
            }
        }).then((data: ChannelSource[]) => {
            resolve(data);
        });
    });
}

declare type CreateSummonCacheOption = {
    message: string,
    owner: string,
    reactions: Record<string, { text: string, voice: string }>,
}

const create_summon_cache = (info: CreateSummonCacheOption, next: Function): void => {
    const today: Date = new Date()
    today.setDate(today.getDate() + 30)
    const expires: string = date_to_string(today)
    for (const r in info.reactions) {
        const cache = new db.summon_cache!()
        cache.message = info.message
        cache.owner = info.owner
        cache.react_id = r
        cache.text = info.reactions[r].text
        cache.voice = info.reactions[r].voice
        cache.expires_at = expires
        cache.save();
    }

    next();
}

declare type FetchSummonTargetOption = {
    message: string,
    react: string,
    owner: string
}

const fetch_summon_target = (info: FetchSummonTargetOption): Promise<SummonCache> => {
    return new Promise((resolve, reject) => {

        const _expires: Date = new Date()
        const expires: string = date_to_string(_expires)

        db.summon_cache.findOne({
            where: {
                message: info.message,
                react_id: info.react,
                owner: info.owner,
                expires_at: {
                    [Sequelize.Op.gte]: expires
                }
            },
        }).then((data: SummonCache) => {
            if (data) {
                resolve(data)
            } else {
                reject()
            }
        })
    })
}

declare type CreateMessageRoomOption = {
    message: string,
    text_channel: string,
    voice_channel: string
}

const create_message_room = (source: CreateMessageRoomOption, next: Function) => {
    const today: Date = new Date()
    today.setDate(today.getDate() + 30)
    const expires: string = date_to_string(today)

    const mr = new db.message_room!()
    mr.message = source.message
    mr.text_channel = source.text_channel
    mr.voice_channel = source.voice_channel
    mr.expires = expires
    mr.save()

    next();
}

const fetch_message_room = (message: string, next: (mr: MessageRoom) => void) => {
    const _expires: Date = new Date()
    const expires: string = date_to_string(_expires)

    db.message_room.findOne({
        where: {
            message: message,
            expires: {
                [Sequelize.Op.gte]: expires
            }
        },
    }).then((data: MessageRoom) => {
        next(data);
    })
}

db.Sequelize = Sequelize;
export default db;
export {
    create_channel,
    find_channel,
    find_channel_expired,
    find_channel_expired_on_date,
    create_summon_cache,
    fetch_summon_target,
    create_message_room,
    fetch_message_room
}
