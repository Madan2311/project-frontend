import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"]
});

socket.on("connect", () => {
    console.log("Socket.io client connected, ID:", socket.id);
  });

export default socket;
