import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { app } from './app.js';
import { Message } from './models/message.model.js';
import { Group } from './models/group.model.js'; 

const onlineUsers = new Map();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN,
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

io.on("connection", async (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    // --- 4. JOIN ROOMS LOGIC ---
    // Find all groups the user is a member of.
    try {
        const userGroups = await Group.find({ members: userId });
        // Have the user's socket join a room for each group.
        userGroups.forEach(group => {
            socket.join(group._id.toString());
        });
    } catch (error) {
        console.error("Error fetching or joining group rooms:", error);
    }

    io.emit("update_online_users", Array.from(onlineUsers.keys()));

    socket.on('start_typing',(data) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        io.to(recipientSocketId).emit('typing_started', { senderId: socket.user.id });
    })
    socket.on('stop_typing',(data) => {
        const { recipientId } = data;
        const recipientSocketId = onlineUsers.get(recipientId);
        io.to(recipientSocketId).emit('typing_stopped', { senderId: socket.user.id });
    })
    
    // --- 5. GROUP MESSAGE HANDLER ---
    socket.on("group_message", async (data) => {
        const { groupId, message } = data;
        if (!groupId || !message) return;

        try {
            // Save the group message to the database
            const newMessage = await Message.create({
                senderId: userId,
                groupId: groupId,
                message: message,
            });

            // Broadcast the message to everyone in the group's room
            io.to(groupId).emit("receive_group_message", newMessage);

        } catch (error) {
            console.error("Error handling group message:", error);
        }
    });

    socket.on("private_message", async (data) => {
        const { recipientId, message } = data;
        try {
            const newMessage = await Message.create({
                senderId: userId,
                recieverId: recipientId,
                message: message,
            });

            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
               socket.broadcast.to(groupId).emit("receive_message", newMessage);
            }
        } catch (error) {
            console.error("Error saving private message:", error);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        io.emit("update_online_users", Array.from(onlineUsers.keys()));
        console.log("❌ User disconnected:", socket.id);
    });
});

export { httpServer };
