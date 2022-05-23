import { v30AuthenticationSettings } from "./settings.js";
import fetch from "isomorphic-fetch";
import { StatusCodes } from "http-status-codes";

const tokens = {};

const refreshToken = (botAgent) => {
  tokens[botAgent.appId] = {};
  getAccessToken(botAgent, (err, token) => {
    if (!err && token) {
      tokens[botAgent.appId] = token;
    }
  });
}

const authenticatedRequest = (
  botAgent,
  requestParameters,
  callback,
  refresh = false
) => {
  if (refresh) {
    tokens[botAgent.appId] = {};
  }
  if (botAgent.appId && botAgent.appPassword) {
    addAccessToken(botAgent, requestParameters, (err) => {
      if (!err) {
        fetch(requestParameters.url, requestParameters)
          .then((response) => {
            switch (response.status) {
              case StatusCodes.UNAUTHORIZED:
              case StatusCodes.FORBIDDEN:
                if (!refresh) {
                  authenticatedRequest(
                    botAgent,
                    requestParameters,
                    callback,
                    true
                  );
                } else {
                  callback(null, response);
                }
                break;
              default:
                if (response.status < 400) {
                  callback(null, response);
                } else {
                  callback(
                    new Error(
                      `Request to '${requestParameters.url}' failed: [${response.status}] ${response.statusText}`
                    ),
                    response,
                    null
                  );
                }
                break;
            }
          })
          .catch((error) => {
            callback(error, null);
          });
      } else {
        callback(err, null);
      }
    });
  } else {
    fetch(requestParameters.url, requestParameters)
      .then((response) => {
        callback(null, response);
      })
      .catch((error) => {
        callback(error, null);
      });
  }
};

const addAccessToken = (botAgent, accessOptions, callback) => {
  if (botAgent.appId && botAgent.appPassword) {
    getAccessToken(botAgent, (err, token) => {
      if (!err && token) {
        tokens[botAgent.appId] = token;
        accessOptions.headers["Authorization"] = "Bearer " + token.accessToken;
        callback(null);
      } else {
        callback(err);
      }
    });
  } else {
    callback(null);
  }
};

const getAccessToken = (botAgent, callback) => {
  const currentToken = tokens[botAgent.appId] || {};
  if (
    !currentToken.accessToken ||
    new Date().getTime() >= currentToken.Expires
  ) {
    // Refresh access token

    var details = {
      grant_type: "client_credentials",
      client_id: botAgent.appId,
      client_secret: botAgent.appPassword,
      scope: `${botAgent.appId}/.default`,
    };
    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(v30AuthenticationSettings.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    })
      .then((response) => {
        if (response.status !== 200) {
          callback(
            new Error(
              `Refresh access token failed with status code: ${response.status}". Error: ${response.error}`
            ),
            null
          );
        } else {
          response.json().then((data) => {
            const accessToken = data.access_token;
            const newAccessTokenExpires =
              new Date().getTime() + (data.expires_in - 300) * 1000;
            callback(null, { accessToken, newAccessTokenExpires });
          });
        }
      })
      .catch((error) => {
        callback(error, null);
      });
  } else {
    callback(null, currentToken);
  }
};

export { authenticatedRequest, refreshToken };
