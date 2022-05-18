import moment  from "moment";
import { uuid } from "uuidv4";

const conversations = {};

const conversationsCleanupInterval = 10000;

const conversationsCleanup = (expiresIn) => {
  setInterval(() => {
    const expiresTime = moment().subtract(expiresIn, "seconds");
    Object.keys(conversations).forEach((conversationId) => {
      if (conversations[conversationId].history.length > 0) {
        const lastTime = moment(
          conversations[conversationId].history[
            conversations[conversationId].history.length - 1
          ].localTimestamp
        );
        if (lastTime < expiresTime) {
          delete conversations[conversationId];
          console.log("deleted cId: " + conversationId);
        }
      }
    });
  }, conversationsCleanupInterval);
};

const createConversationUpdateActivity = (serviceUrl, conversationId) => {
  const activity = {
    type: "conversationUpdate",
    channelId: "emulator",
    serviceUrl,
    conversation: { id: conversationId },
    id: uuid(),
    membersAdded: [],
    membersRemoved: [],
    from: { id: "offline-directline", name: "Offline Directline Server" },
  };
  return activity;
};

const getConversation = (conversationId, conversationInitRequired) => {
  // Create conversation on the fly when needed and init not required
  if (!conversations[conversationId] && !conversationInitRequired) {
    conversations[conversationId] = {
      conversationId,
      history: [],
    };
  }
  return conversations[conversationId];
};

const createConversation = () => {
  const newConversationId = uuid();
  conversations[newConversationId] = {
    conversationId: newConversationId,
    history: [],
  };
  console.log("Created conversation with conversationId: " + newConversationId);
  return newConversationId;
};

const createMessageActivity = (
  incomingActivity,
  serviceUrl,
  conversationId
) => {
  const activity = {
    id: uuid(),
    channelId: "emulator",
    serviceUrl,
    conversation: { id: conversationId },
    ...incomingActivity,
  };

  return activity;
};

const createActivityFromBot = (incomingActivity) => {
  const activity = {
    id: uuid(),
    from: {
      id: "id",
      name: "bot",
    },
    ...incomingActivity,
  };

  return activity;
};

export {
  createConversation,
  getConversation,
  createConversationUpdateActivity,
  createMessageActivity,
  conversationsCleanup,
  createActivityFromBot,
};
