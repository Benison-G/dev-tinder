const crypto = require("crypto");

const initializeSocket = (server) => {
    const socket = require("socket.io");

    const getSecretRoomId = (userId, targetUserId) => {
        return crypto
            .createHash("sha256")
            .update([userId, targetUserId].sort().join("$"))
            .digest("hex");
    };

    // Initialize IO
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    //Receive the connection
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log("Message received: " + text);
            io.to(roomId).emit("receiveMessage", { firstName, userId, text });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}

module.exports = { initializeSocket };
