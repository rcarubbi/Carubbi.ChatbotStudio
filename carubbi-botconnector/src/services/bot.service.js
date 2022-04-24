const directline = require("../bridge");
const express = require("express");
const getPort = require("get-port");
const config = require("../config.json");
 
function botService() {

    const createInstance = async (botName) => {
        const app = express();
        const port = await getPort({ port: getPort.makeRange(1024, 65535) })
        const botEndpoint = `${config.botEngineEndpoint}/${botName}`;
        directline.initializeRoutes(app, port, botEndpoint);
        return {
            endpoint: `${config.directLineEndpoint}:${port}/directline`
        };
    };

    const getDirectlineInstance = async (botName) => {
        const bot = global.bots.find(el => el.botName === botName);
        if (!bot) {
            const botCreationResult = await createInstance(botName);
            const newBot = { botName, endpoint: botCreationResult.endpoint };
            global.bots.push(newBot)
            return newBot;
        } else {
            return bot;
        }
    }

    return {
        getDirectlineInstance
    }
}

const serviceInstance = botService();

global.bots = [];

module.exports = serviceInstance; 