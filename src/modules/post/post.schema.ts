import z from "zod";
import { BadRequestException } from "../../common";


export const createPostSchema = z
    .object({
        content: z.string().optional(),
        attachments: z.array(z.string()).optional(), 
    })
    .refine((data)=>{ // bahoott sharrttt
        const { content, attachments } = data;
        if (!content && (!attachments ||  attachments.length == 0 )){
            throw new BadRequestException("Content or attachments must be provided") 
        }
        return true;
    })

export const updatePostSchema = z.object({
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
});