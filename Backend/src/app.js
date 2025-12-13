const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}))



const authroutes = require('./routes/auth.routes')
const sweetsroutes = require('./routes/sweets.routes')

app.use('/api/auth' , authroutes);
app.use('/api' , sweetsroutes);

module.exports = app;