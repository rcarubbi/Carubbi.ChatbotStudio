
const botDataStore = {};

const getBotDataKey = (channelId, conversationId, userId) => {
    return `$${channelId || '*'}!${conversationId || '*'}!${userId || '*'}`;
};

const setBotData = (channelId, conversationId, userId, incomingData) => {
    const key = getBotDataKey(channelId, conversationId, userId);
    const newData = {
        eTag: new Date().getTime().toString(),
        data: incomingData.data,
    };
    if (incomingData) {
        botDataStore[key] = newData;
    }
    else {
        delete botDataStore[key];
        newData.eTag = '*';
    }
    return newData;
};

const getBotData = (req, res) => {
    const key = getBotDataKey(req.params.channelId, req.params.conversationId, req.params.userId);
    console.log('Data key: ' + key);
    res.status(200).send(botDataStore[key] || { data: null, eTag: '*' });
};

const setUserData = (req, res) => {
    res.status(200).send(setBotData(req.params.channelId, req.params.conversationId, req.params.userId, req.body));
};

const setConversationData = (req, res) => {
    res.status(200).send(setBotData(req.params.channelId, req.params.conversationId, req.params.userId, req.body));
};

const setPrivateConversationData = (req, res) => {
    res.status(200).send(setBotData(req.params.channelId, req.params.conversationId, req.params.userId, req.body));
};

const deleteStateForUser = (req, res) => {
    Object.keys(botDataStore)
        .forEach((key) => {
        if (key.endsWith(`!{req.query.userId}`)) {
            delete botDataStore[key];
        }
    });
    res.status(200).send();
};

export {
    getBotData,
    setUserData,
    setConversationData,
    setPrivateConversationData,
    deleteStateForUser
}