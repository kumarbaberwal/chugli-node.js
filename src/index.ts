import express, { Request, Response } from 'express';
import {json} from 'body-parser';
import authRouter from './routes/authRoutes';
import conversationsRouter from './routes/conversationRoutes';


const app = express();

app.use(json());

app.get('/', (req: Request, res: Response)=>{
    res.send("Server is Working properly");
});

app.use('/auth', authRouter);
app.use('/conversations', conversationsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});