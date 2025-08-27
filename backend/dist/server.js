import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { neon } from "@neondatabase/serverless";
const data = [];
const app = express();
app.use(express.json());
const sql = neon(process.env.DATABASE_URL);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://10.0.0.10:5173",
        "https://chitchat-hhye.onrender.com",
    ], // <- no trailing slash
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.get("/", async (_, res) => {
    const result = (await sql `SELECT version()`);
    const { version } = result[0];
    res.json(version);
});
app.get("/health", (_, res) => res.json({ ok: true }));
app.post("/rooms", async (req, res) => {
    const { room, name, friend } = req.body;
    try {
        // Check if room already exists
        const existingRoom = await sql `
        SELECT id, room_id FROM rooms WHERE room_id = ${room}
      `;
        if (existingRoom.length > 0) {
            return res.status(409).json({
                error: "Room already exists",
                room: existingRoom[0],
            });
        }
        // Insert new room
        const newRoom = await sql `
        INSERT INTO rooms (room_id, name, friend_name) 
        VALUES (${room}, ${name}, ${friend}) 
        RETURNING id, room_id, name, friend_name, created_at
      `;
        res.status(201).json({
            success: true,
            room: newRoom[0],
        });
    }
    catch (err) {
        console.error("Error creating room:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/chats", async (req, res) => {
    const { name } = req.body;
    try {
        const rooms = await sql `
        SELECT
          id,
          room_id,
          created_at,
          name,
          friend_name
        FROM rooms
        WHERE name = ${name} OR friend_name = ${name}
        ORDER BY created_at ASC
      `;
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/addGroup", async (req, res) => {
    const { room, groupName, contacts } = req.body;
    const [name1, name2, name3, name4, name5] = [
        contacts[0] || null,
        contacts[1] || null,
        contacts[2] || null,
        contacts[3] || null,
        contacts[4] || null,
    ];
    try {
        const result = await sql `
        INSERT INTO groups (
          room_id, group_name, name1, name2, name3, name4, name5
        ) VALUES (
          ${room}, ${groupName}, ${name1}, ${name2}, ${name3}, ${name4}, ${name5}
        )
        RETURNING *;
      `;
        res.status(201).json(result[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});
app.post("/groups", async (req, res) => {
    const { name } = req.body;
    try {
        const rows = await sql `
      SELECT *
      FROM groups
      WHERE name1 = ${name}
         OR name2 = ${name}
         OR name3 = ${name}
         OR name4 = ${name}
         OR name5 = ${name};
    `;
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://10.0.0.10:5173",
            "https://chitchat-hhye.onrender.com",
        ],
        credentials: true,
    },
});
io.on("connection", (socket) => {
    socket.on("room:join", (room) => {
        socket.join(room);
    });
    socket.on("room:leave", (room) => {
        socket.leave(room);
    });
    socket.on("client:message:sent", async (msg) => {
        const { message, name, room } = msg;
        // Insert message into database
        const insertedMessage = await sql `
        INSERT INTO messages (room_id, message, name)
        VALUES (${room}, ${message}, ${name})
        RETURNING id, room_id, message, name, created_at
      `;
        const savedMessage = insertedMessage[0];
        const messages = await sql `
      SELECT 
        id,
        room_id,
        message,
        name,
        created_at
      FROM messages 
      WHERE room_id = ${room}
      ORDER BY created_at ASC
      `;
        io.to(room).emit("server:messages:sent", messages);
    });
    socket.on("client:getMessages", async (room) => {
        const messages = await sql `
      SELECT 
        id,
        room_id,
        message,
        name,
        created_at
      FROM messages 
      WHERE room_id = ${room}
      ORDER BY created_at ASC
      `;
        io.to(room).emit("server:messages:sent", messages);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
const HOST = "0.0.0.0";
httpServer.listen(3000, HOST, () => {
    console.log("Server listening on http://localhost:3000");
});
//# sourceMappingURL=server.js.map