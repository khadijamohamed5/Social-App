import { type NextFunction, type Request, type Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { isAuthenticated, isValid } from "../../common/middlewares";
import { createPostSchema } from "./post.schema";
import { addReaction } from "../../common";
import { postRepo } from "../../DB/models/post/post.repository";
import commentRouter from "../comment/comment.controller";

const postRouter = Router();


// create post
postRouter.post("/", isAuthenticated ,isValid(createPostSchema),async (req : Request, res: Response, next: NextFunction)=>{
    const createPost = await postService.create(
        req.body,
        req.user._id
    )
    return res.status(201).json({
        message : "post created successfully",
        success : true,
        data : {createPost}
    })
})

// add reaction 
postRouter.post("/add-reaction", isAuthenticated,async (req : Request, res: Response, next: NextFunction)=>{
    await addReaction(
        req.body,
        req.user._id,
        postRepo,
    )
    return res.sendStatus(204) 
})

// Get All Posts (Feed)
postRouter.get("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.getAllPosts();
    return res.status(200).json({ message: "success", success: true, data: posts });
});


// Update Post
postRouter.patch("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const updatedPost = await postService.updatePost(
        new Types.ObjectId(req.params.id as string),
        req.user._id,
        req.body
    );
    return res.status(200).json({ message: "post updated successfully", success: true, data: updatedPost });
});


// Delete Post
postRouter.delete("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    await postService.deletePost(
        new Types.ObjectId(req.params.id as string),
        req.user._id
    );
    return res.status(200).json({ message: "post deleted successfully", success: true });
});





// create route >> post/postId/comment/commentId (reply)
// after : post/
postRouter.use("/:postId/comment",commentRouter ) // >> post/:postId/comment  




export default postRouter;