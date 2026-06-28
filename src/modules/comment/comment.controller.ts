import { type NextFunction, type Request, type Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";
import { isAuthenticated } from "../../common/middlewares";

const commentRouter = Router({mergeParams : true}); 

// in express 4 >> /:parentId?
// in express 5 >> {/:parentId}     

// url /comment/postId/parnetId"optional"
// to do ( Validation , file upload, auth)


// /post/postId/comment/add-reaction  OR /comment/add-reaction 
commentRouter.post('/add-reaction', isAuthenticated ,async (req : Request, res : Response, next : NextFunction)=>{ // : dynamic param
    await addReaction(
        req.body, 
        req.user._id,
        commentRepo
    )
    res.sendStatus(204)
})

// create comment reply on comment >> comment/12345566   (hygeb postId mn el comment data)
// create comment reply on comment >> post/12345678/comment/98765442
// create comment on post >> post/12345678/comment

// >> post/:postId/comment + {/:parentId} = reply
commentRouter.post('{/:parentId}',isAuthenticated ,async (req : Request, res : Response, next : NextFunction)=>{ // : dynamic param
    const createdComment = await commentService.create(
        req.body, 
        req.params, 
        req.user._id, // auth
    )
    res.sendStatus(201).json({data : createdComment})
})

//get all comments from post 
//or get all comments from comment (reply)
commentRouter.get('/:postId{/:parentId}', async (req : Request, res : Response, next : NextFunction)=>{ 
    const comments = await commentService.getAll(req.params)
    res.status(200).json({ data : comments, success : true })
})

commentRouter.delete("/:id", isAuthenticated,async (req : Request, res : Response, next : NextFunction)=>{
    await commentService.delete(
        new Types.ObjectId (req.params.id as string),  
        req.user._id,
    )
    return res.sendStatus(204)
})

commentRouter.patch("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const updatedComment = await commentService.update(
        new Types.ObjectId(req.params.id as string),
        req.user._id,
        req.body.content
    );
    return res.status(200).json({ message: "comment updated", success: true, data: updatedComment });
});


export default commentRouter;