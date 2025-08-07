import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { InitializeSocket } from "./config/socket.js";
import cors from "cors";

dotenv.config({ quiet: true });

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

const app = express();
const httpServer = createServer(app);
const io = InitializeSocket(httpServer, corsOptions);

// necessary middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Essential routes
app.get("/", (req, res) => {
    res.send("Hello, I am gateway server!");
})

// socket connections

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const global_room = "global_room";

    socket.on("join-room", ({ userName }) => {
        console.log(`user joined: ${userName}`);

        socket.join(global_room);

        socket.emit("user-joined-room", { userName });
    })

    socket.on("message", ({ userName, message }) => {
        console.log(`${message} from ${userName}`);
        
        io.to(global_room).emit("messageArrived", { userName, message });
    })

})

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
})