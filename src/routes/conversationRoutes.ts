import { Router, Request, Response } from "express";
import pool from '../models/db';
import { veryfyToken } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', veryfyToken, async(req: Request, res: Response) => {
    let userId = null;
    if(req.user){
        userId = req.user.userId;
    }

    try{
        const result = await pool.query(
            `select c.id as conversation_id, u.username as participant_name, m.content as last_message, m.created_at as last_message_time
            from conversations c
            join users u on (u.id = c.participant_two and u.id != $1)
            left join lateral (
                select content, created_at
                from messages
                where conversation_id = c.id
                order by created_at desc
                limit 1
            ) m on true
             where c.participant_one = $1 or c.participant_two = $1
             order by m.created_at desc;
            `,
            [userId]
        );

        res.status(200).json(result.rows);
    }
    catch(e){
        console.log(`error: ${e}`)
        res.status(500).json({message: 'Failed to fetch the conversation'})
    }
});


export default router;