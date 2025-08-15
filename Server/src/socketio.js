import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { app } from './app.js';
import { Message } from './models/message.model.js';
import { apiError } from './utils/ApiError.js';

const onlineUsers = new Map()

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error: Token not provided"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded;
        next();
    });
});

io.on("connection", (socket) => {
    const userId = socket.user._id;
    onlineUsers.set(userId, socket.id);

    socket.on("private_message", async (data) => {
        const { recipientId, message } = data;

        try {
            const newMessage = await Message.create({
                senderId: userId,
                recipientId: recipientId,
                content: message,
            });

            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receive_message", newMessage);
            }
        } catch (error) {
            throw new apiError(500, error.message);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        console.log("❌ User disconnected:", socket.id);
        console.log("Online users:", Array.from(onlineUsers.keys()));
    });
});

export { httpServer }