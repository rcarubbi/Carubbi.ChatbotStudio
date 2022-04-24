import React, { useEffect, useState, useCallback } from "react";
import ReactWebChat from "botframework-webchat";
import { DirectLine } from "botframework-directlinejs";
import CustomInput from "../../material-dashboard/CustomInput/CustomInput";
import { withStyles } from "@material-ui/core";

const styles = {
    webchatContainer: {
        position: "absolute",
        zIndex: "1000",
        boxShadow: "1px 1px 5px grey",
        borderRadius: "10px",
        padding: "10px",
        bottom: "60px",
        right: "78px",
        backgroundColor: "white",
    },
    webchat: {
        width: "400px",
        height: "450px",
    }
};

function WebChat({ visible, classes, runtime }) {

    const [channelId, setChannelId] = useState("webchat");
    const [directLine, setDirectline] = useState(
        new DirectLine({ webSocket: false })
    );

    const handleChannelIdChanged = e => {
        setChannelId(e.target.value);
    };

    const reloadWebchatConnection = useCallback(async (runtime, channelId) => {
        const botConfig = JSON.parse(runtime);

        setDirectline(
            new DirectLine({
                domain: process.env.REACT_APP_DIRECTLINE_ENDPOINT,
                webSocket: false,
                botAgent: JSON.stringify({ channelId, botId : botConfig.id })
            })
        );
    }, []);

    useEffect(() => {
        if (visible) {
            reloadWebchatConnection(runtime, channelId)
        }
    }, [visible, runtime, channelId, reloadWebchatConnection]);

    return <>{visible ?
        (<div className={classes.webchatContainer}>
            <CustomInput
                labelText="Nome do canal"
                id="channel"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    type: "text",
                    onChange: handleChannelIdChanged,
                    value: channelId
                }}
            />
            <ReactWebChat
                className={classes.webchat}
                directLine={directLine}
                userID={"BotBuilder"}
                username={"Bot Builder"}
            />
        </div>
        ) : (
            <></>
        )}</>
}

export default withStyles(styles)(WebChat);