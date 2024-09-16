import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';


import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();
const PORT = process.env.PORT || 4000


dotenv.config();

app.use(express.json());
app.use(cookieParser()); //to parse incoming cookies

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server started on port ${PORT}`)   
})