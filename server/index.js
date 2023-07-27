import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import {userRouter} from "./routes/users.js"
import {recipesRouter} from "./routes/recipes.js"
dotenv.config();

const PORT = parseInt(process.env.PORT);

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth',userRouter)
app.use('/recipes',recipesRouter)

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});


