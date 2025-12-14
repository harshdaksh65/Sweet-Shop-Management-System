const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow both local dev frontend and deployed frontend (via FRONTEND_URL env)
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));



const authroutes = require('./routes/auth.routes')
const sweetsroutes = require('./routes/sweets.routes')

app.use('/api/auth' , authroutes);
app.use('/api' , sweetsroutes);

module.exports = app;