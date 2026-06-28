import { Router } from "express";
import { type NextFunction, type Request, type Response } from "express";
import friendRequestService from "./friend-request.service";
import { Types } from "mongoose";
import { isAuthenticated } from "../../common/middlewares";

const requestRouter =  Router();

requestRouter.post("/:receiverId", isAuthenticated, async (req : Request, res: Response, next: NextFunction)=>{
    await friendRequestService.sendRequest(
        req.user._id,
        new Types.ObjectId(req.params.receiverId as string)
    )
    return res.sendStatus(204)
})

requestRouter.post("/accept/:requestId", isAuthenticated, async (req : Request, res: Response, next: NextFunction)=>{
    await friendRequestService.acceptRequest(
        req.user._id, // id el recevier 
        new Types.ObjectId(req.params.requestId as string)
    )
    return res.sendStatus(204)
})

requestRouter.delete("/decline/:requestId", isAuthenticated, async (req : Request, res: Response, next: NextFunction)=>{
    await friendRequestService.declineOrCancelRequest(
        req.user._id, // id el recevier 
        new Types.ObjectId(req.params.requestId as string)
    )
    return res.sendStatus(204)
})


requestRouter.delete("/remove/:friendId", isAuthenticated, async (req : Request, res: Response, next: NextFunction)=>{
    await friendRequestService.removeFriend(
        req.user._id, // id el recevier 
        new Types.ObjectId(req.params.friendId as string)
    )
    return res.sendStatus(204)
})

// Get all pending friend requests for logged-in user
requestRouter.get("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const requests = await friendRequestService.getMyRequests(req.user._id);
    return res.status(200).json({ message: "success", success: true, data: requests });
});


export default requestRouter