const getBotAgentFromHeader = (req) => {
   
    const msBotAgentHeader = req.header('x-ms-bot-agent');
    if (msBotAgentHeader) {
        const msBotAgentHeaderParts = msBotAgentHeader.split(';');
        if (msBotAgentHeaderParts.length > 1) {
            const botAgentJson = msBotAgentHeaderParts[1].substring(0, msBotAgentHeaderParts[1].length - 1).trim();
            console.log(botAgentJson);
            return JSON.parse(botAgentJson);;
        }   
    }
    return { botId: '00000000-0000-0000-0000-000000000000' };;
}

export default getBotAgentFromHeader;