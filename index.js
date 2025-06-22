import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import AuthorizationRoutes from './Routes/Authorization.js';
import FrontPageRoutes from './Routes/FrontPage.js';
import PersonalPageRoutes from './Routes/PersonalPage.js';
import http from 'http';
import { db } from './Models/db.js'; 

const app = express();
app.use(express.json());
const server = http.createServer(app);


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];




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




app.use('/api/Authorization', AuthorizationRoutes);
app.use('/api/FrontPage/',FrontPageRoutes);
app.use('/api/PersonalPage/',PersonalPageRoutes);





const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

