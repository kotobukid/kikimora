import {KikimoraClient} from "../types";
import process from "process";

const func = (client: KikimoraClient, msg: any) => {
    msg.channel.send("I'll be back").then();
    console.log("I'll be back");

    setTimeout(() => {
        client.destroy();
        process.exit();
    }, 2500);
}

export default func;



