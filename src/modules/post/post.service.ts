import { Types } from "mongoose";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CreatePostDto } from "./post.dto";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { NotFoundException, UnAuthorizedException } from "../../common";

export class PostService {
    constructor(
        private readonly postRepository:PostRepository,
        )
        {}

    async create(createPostDto : CreatePostDto, userId : Types.ObjectId, ){
        return await this.postRepository.create({...createPostDto, userId})
    }

    // gql 
    async getPost (postId : Types.ObjectId){
        const post = await this.postRepository.getOne({_id : postId},{},{populate : {path : "userId"}}) // populate >> haygeb el userId w hwa rage3 [{}]
        if (!post) {
            throw new NotFoundException("post not found")
        }
        return post;
    }

    async updatePost( postId: Types.ObjectId, userId: Types.ObjectId, updateData: { content?: string, attachments?: string[]}) {
        // check post exists
        const postExist = await this.postRepository.getOne({ _id: postId });
        if (!postExist) {
            throw new NotFoundException("post not found");
        }

        // check ownership (author only can edit)
        if (postExist.userId.toString() !== userId.toString()) {
            throw new UnAuthorizedException("you are not allowed to update this post");
        }

        // update post
        const updatedPost = await this.postRepository.updateOne(
            { _id: postId },
            {
                ...(updateData.content && { content: updateData.content }),
                ...(updateData.attachments && { attachments: updateData.attachments }),
            },
            { returnDocument: "after" }
        );

        return updatedPost;
    }

    async deletePost(postId: Types.ObjectId, userId: Types.ObjectId) {
        // check post exists
        const postExist = await this.postRepository.getOne({_id: postId});
        if (!postExist) {
            throw new NotFoundException("post not found");
        }
    
        // check ownership
        if (postExist.userId.toString() !== userId.toString()) {
            throw new UnAuthorizedException("you are not allowed to delete this post");
        }
    
        // delete post
        await this.postRepository.deleteOne({_id: postId});
    
        return true;
    }

    async getAllPosts(){
        return await this.postRepository.getAll(
            {}, 
            {}, 
            { sort: { createdAt: -1 }, populate: { path: "userId" } } 
        );
    }
}


export default new PostService(new PostRepository())