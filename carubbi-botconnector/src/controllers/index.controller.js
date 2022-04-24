const botService = require('../services/bot.service');
 
exports.getInstance = async (req, res) => {

    const botName = req.body["botName"];
    const bot = await botService.getDirectlineInstance(botName);
    if (bot) {
        res.status(200).send(bot);
    } else {
        res.status(500).send({
            message: 'Erro ao criar instancia da directline API'
        });
    }
};


