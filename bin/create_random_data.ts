import _ from "lodash"
import {create_channel} from "../models"
import {Channel} from "../models/channel"
import {Model} from "sequelize";

_.range(10).forEach((i: number): void => {
    create_channel({
        owner: '123435123' + i,
        owner_name: 'hagege',
        channel_name: '俺のチャンネル' + i,
        text_channel: `${Math.floor(Math.random() * 100000000000000)}`,
        voice_channel: `${Math.floor(Math.random() * 100000000000000)}`,
        prevent_auto_delete: 0
    }).then((ch: Model<Channel>): void => {
        console.log(ch)
    })
})
