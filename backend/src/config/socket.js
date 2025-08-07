import { Server } from "socket.io";

let io;

function InitializeSocket(httpServer, corsOptions) {
    io = new Server(httpServer, {
        cors: corsOptions
    })

    return io;
}

function getIO() {
    if (!io) throw new Error(`Socket not initialized!`)
    return io;
}

export { InitializeSocket, getIO };