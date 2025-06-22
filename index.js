import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import createAuthorizationRoutes from './Routes/Authorization.js';
import createFrontPageRoutes from './Routes/FrontPage.js';
import createPersonalPageRoutes from './Routes/PersonalPage.js';
import http from 'http';
import { db } from './Models/db.js'; 

import { Server } from 'socket.io'; // ✅ ADDED: import socket.io

const app = express();
app.use(express.json());
const server = http.createServer(app);


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];


// ✅ ADDED: Socket.IO initialization
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ ADDED: Socket.IO event handling
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("send-message", (data) => {
    console.log("📩 Message received via socket:", data);

    // Broadcast to all other users
    socket.broadcast.emit("message-received", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));




// Update your custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});


app.set("io", io); // ✅ Attach socket instance to Express app

app.use('/api/Authorization', createAuthorizationRoutes(io));
app.use('/api/FrontPage/',createFrontPageRoutes(io));
app.use('/api/PersonalPage/',createPersonalPageRoutes(io));





const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

