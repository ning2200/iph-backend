import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsMiddleware = cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Connection'],
    credentials: true,
});

export default corsMiddleware;

// exposedHeaders: for specific headers sent by backend to frontend eg. custom headers for pagination
// preFlightContinue: ensure cors respond to options request automatically
// maxAge: maximum time of pre-flight cache 