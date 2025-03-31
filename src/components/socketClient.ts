import {
    TelepartyClient,
    SocketEventHandler,
    // SocketMessageTypes,
    // SessionChatMessage,
} from "teleparty-websocket-lib";

const eventHandler: SocketEventHandler = {
    onConnectionReady: () => {
        console.log("Connection Establish")
    },
    onClose: () => {
        console.log("Socket Closed, Please refresh!");
    },
    onMessage: (meesage) => {
        console.log("Message Received!", meesage);
    }
}

const client = new TelepartyClient(eventHandler);

export default client;