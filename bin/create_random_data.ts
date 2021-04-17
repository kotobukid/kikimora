import _ from "lodash"
import {create_channel} from "../models"
import {Channel} from "../models/channel"
import {Model} from "sequelize";

_.range(100000).forEach(i => {
    create_channel({
        owner: '123435123' + i,
        owner_name: 'hagege',
        channel_name: '俺のチャンネル' + i,
        text_channel: `${Math.floor(Math.random() * 100000000000000)}`,
        voice_channel: `${Math.floor(Math.random() * 100000000000000)}`
    }).then((ch: Model<Channel>) => {
        console.log(ch)
    })
})
