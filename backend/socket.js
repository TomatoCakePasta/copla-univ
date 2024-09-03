import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        // 全てからのアクセスを許可
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 8000;

let activeClients = 0;

app.get("/", (req, res) => {
    res.send("Hello Socket");
});

io.on("connection", (socket) => {
    ++activeClients;
    console.log("a user connected, now ", activeClients);

    socket.on("makePost", () => {
        console.log("maked new post");
        socket.emit("getPosts");
    });

    socket.on("disconnect", () => {
        --activeClients;
        console.log("a user exit , now ", activeClients);
    })
});

server.listen(PORT, () => {
    console.log(`server is running at http://localhost:${ PORT }`);
});