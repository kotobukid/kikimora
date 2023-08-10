const argv = process.argv;
const find_channel = require("../models").find_channel;
// import {ChannelSource} from "../models/channel";

if (argv.length === 3) {

    const target_text_channel: string = argv[2];

    find_channel({
        text_channel: target_text_channel,
        // @ts-ignore
    }).then((channels: ChannelSource []) => {
        for (let i: number = 0; i < channels.length; i++) {

            // @ts-ignore
            channels[i].update({
                prevent_auto_delete: 1
            }).then((res: any) => {
                console.log(`"text_channel: ${res.getDataValue('text_channel')}" ok.`)
            })
        }
    }).catch((err: Error) => {
        console.error(err)
    });
} else {
    console.error('"-- ${id}" required.')
}