import express from "express";
import bodyParser from "body-parser";
import botAgentExtractor from "./botAgentExtractor.js";
import { authenticatedRequest, refreshToken } from "./authentication.js";

import {
  createConversation,
  createConversationUpdateActivity,
  createActivityFromBot,
  createMessageActivity,
  getConversation,
} from "./conversationManager.js";

import {
  getBotData,
  setUserData,
  setConversationData,
  setPrivateConversationData,
  deleteStateForUser,
} from "./botDataStore.js";

const getRouter = (
  serviceUrl,
  botUrl,
  conversationInitRequired = true,
  expiresIn
) => {
  const router = express.Router();

  router.use(bodyParser.json()); // for parsing application/json
  router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, DELETE, PATCH, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-ms-bot-agent"
    );
    next();
  });

  router.options("/directline", (req, res) => {
    res.status(200).end();
  });

  router.post("/directline/tokens/refresh", (req, res) => {
    const botAgent = botAgentExtractor(req);
    refreshToken(botAgent);
    res.status(200).end();
  });

  router.post("/directline/conversations", (req, res) => {
    const botAgent = botAgentExtractor(req);

    const conversationId = createConversation();
    const activity = createConversationUpdateActivity(
      serviceUrl,
      conversationId
    );

    const request = {
      url: `${botUrl}/${botAgent.botId}`,
      method: "POST",
      body: JSON.stringify(activity),
      headers: {
        "Content-Type": "application/json",
      },
    };

    authenticatedRequest(botAgent, request, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(response.status).send({
          conversationId,
          expiresIn,
        });
      }
    });
  });

  router.get(
    "/directline/conversations/:conversationId/activities",
    (req, res) => {
      const watermark =
        req.query.watermark && req.query.watermark !== "null"
          ? Number(req.query.watermark)
          : 0;

      const conversation = getConversation(
        req.params.conversationId,
        conversationInitRequired
      );
      if (conversation) {
        // If the bot has pushed anything into the history array
        if (conversation.history.length > watermark) {
          const activities = conversation.history.slice(watermark);
          res.status(200).json({
            activities,
            watermark: watermark + activities.length,
          });
        } else {
          res.status(200).send({
            activities: [],
            watermark,
          });
        }
      } else {
        // Conversation was never initialized
        res.status(400).send();
      }
    }
  );

  // Sends message to bot. Assumes message activities
  router.post(
    "/directline/conversations/:conversationId/activities",
    (req, res) => {
      const incomingActivity = req.body;
      // Make copy of activity. Add required fields
      const activity = createMessageActivity(
        incomingActivity,
        serviceUrl,
        req.params.conversationId
      );
      const conversation = getConversation(
        req.params.conversationId,
        conversationInitRequired
      );
      if (conversation) {
        conversation.history.push(activity);
        const botAgent = botAgentExtractor(req);

        

        const request = {
          url: `${botUrl}/${botAgent.botId}`,
          method: "POST",
          body: JSON.stringify(activity),
          headers: {
            "Content-Type": "application/json",
          },
        };

        authenticatedRequest(botAgent, request, (err, response, body) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(response.status).json({ id: activity.id });
          }
        });
      } else {
        // Conversation was never initialized
        res.status(400).send();
      }
    }
  );

  // BOT CONVERSATION ENDPOINT

  router.post("/v3/conversations/:conversationId/activities", (req, res) => {
    const activity = createActivityFromBot(req.body);
    const conversation = getConversation(
      req.params.conversationId,
      conversationInitRequired
    );
    if (conversation) {
      conversation.history.push(activity);
      res.status(200).send();
    } else {
      // Conversation was never initialized
      res.status(400).send();
    }
  });

  router.post(
    "/v3/conversations/:conversationId/activities/:activityId",
    (req, res) => {
      const activity = createActivityFromBot(req.body);
      const conversation = getConversation(
        req.params.conversationId,
        conversationInitRequired
      );
      if (conversation) {
        conversation.history.push(activity);
        res.status(200).send();
      } else {
        // Conversation was never initialized
        res.status(400).send();
      }
    }
  );

  router.get("/v3/botstate/:channelId/users/:userId", (req, res) => {
    console.log("Called GET user data");
    getBotData(req, res);
  });
  router.get(
    "/v3/botstate/:channelId/conversations/:conversationId",
    (req, res) => {
      console.log("Called GET conversation data");
      getBotData(req, res);
    }
  );
  router.get(
    "/v3/botstate/:channelId/conversations/:conversationId/users/:userId",
    (req, res) => {
      console.log("Called GET private conversation data");
      getBotData(req, res);
    }
  );
  router.post("/v3/botstate/:channelId/users/:userId", (req, res) => {
    console.log("Called POST setUserData");
    setUserData(req, res);
  });
  router.post(
    "/v3/botstate/:channelId/conversations/:conversationId",
    (req, res) => {
      console.log("Called POST setConversationData");
      setConversationData(req, res);
    }
  );
  router.post(
    "/v3/botstate/:channelId/conversations/:conversationId/users/:userId",
    (req, res) => {
      setPrivateConversationData(req, res);
    }
  );
  router.delete("/v3/botstate/:channelId/users/:userId", (req, res) => {
    console.log("Called DELETE deleteStateForUser");
    deleteStateForUser(req, res);
  });

  // not implemented routes
  router.post("/v3/conversations", (req, res) => {
    console.warn("/v3/conversations not implemented");
  });

  router.get("/v3/directline/conversations/:conversationId", (req, res) => {
    console.warn(
      "/v3/directline/conversations/:conversationId not implemented"
    );
  });

  router.get("/v3/conversations/:conversationId/members", (req, res) => {
    console.warn("/v3/conversations/:conversationId/members not implemented");
  });

  router.get(
    "/v3/conversations/:conversationId/activities/:activityId/members",
    (req, res) => {
      console.warn(
        "/v3/conversations/:conversationId/activities/:activityId/members"
      );
    }
  );

  router.post(
    "/v3/directline/conversations/:conversationId/upload",
    (req, res) => {
      console.warn(
        "/v3/directline/conversations/:conversationId/upload not implemented"
      );
    }
  );
  router.get(
    "/v3/directline/conversations/:conversationId/stream",
    (req, res) => {
      console.warn(
        "/v3/directline/conversations/:conversationId/stream not implemented"
      );
    }
  );

  return router;
};
export default getRouter;
