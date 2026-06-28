import { type NextFunction, type Request, type Response, Router } from "express";
import { isAuthenticated } from "../../common/middlewares";
import chatService from "./chat.service";
import { Types } from "mongoose";

const chatRouter = Router();

// get chat
chatRouter.get("/:userId",isAuthenticated,async (req : Request, res: Response, next: NextFunction)=>{
    const {chat, messages } = await chatService.getChat(
        new Types.ObjectId(req.params.userId as string), 
        new Types.ObjectId(req.user._id)
    )
    return res.status(200).json({ message : "success", data : {chat, messages}})
})

//get all chat 
chatRouter.get("/",isAuthenticated, async (req: Request, res: Response) => {
    const chats = await chatService.getAllChats(req.user._id);
    return res.status(200).json({success: true, data: chats});
    }
);

// Create Chat 
chatRouter.post("/:userId", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const chat = await chatService.createChat(
        new Types.ObjectId(req.params.userId as string),
        req.user._id
    );
    return res.status(201).json({ message: "chat created successfully", success: true, data: chat });
});

// Send Message in chat
chatRouter.post("/:chatId/messages", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const message = await chatService.sendMessage(
        new Types.ObjectId(req.params.chatId as string),
        req.user._id,
        req.body.content
    );
    return res.status(201).json({ message: "message sent successfully", success: true, data: message });
});




export default chatRouter;