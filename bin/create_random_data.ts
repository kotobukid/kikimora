import _ from "lodash"
import db from '../models'

_.range(100).forEach(i => {
    const c = new db.channel!()
    c.owner = '123435123' + i
    c.owner_name = 'hagege'
    c.channel_name = '俺のチャンネル' + i
    c.text_channel = `${Math.floor(Math.random() * 100000000000000)}`
    c.voice_channel = `${Math.floor(Math.random() * 100000000000000)}`
    c.is_deleted = false
    c.save()
})
