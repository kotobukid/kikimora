import {KikimoraClient} from "../types";
import process from "process";
import {Message} from "discord.js";

const func = (client: KikimoraClient, msg: Message) => {
    msg.channel.send("I'll be back").then();
    console.log("I'll be back");

    setTimeout(() => {
        client.destroy();
        process.exit();
    }, 2500);
}

export default func;



