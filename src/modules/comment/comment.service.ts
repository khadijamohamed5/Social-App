import { Types } from "mongoose";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CreateCommentDTO } from "./comment.dto";
import { IPost, NotFoundException, UnAuthorizedException } from "../../common";

class CommentService {
    constructor(
        private readonly postRepository:PostRepository,
        private readonly commentRepository:CommentRepository,
    ){}

    async create(createCommentDTO: CreateCommentDTO, params: any, userId: Types.ObjectId){
        // check post exist 
        if(params.postId){
            const postExist = await this.postRepository.getOne({ _id: params.postId})
            if(!postExist) throw new NotFoundException("post not found")
        }

        // check if parentId (reply)
        let parentCommentExist= undefined;
        if(params.parentId){
            parentCommentExist = await this.commentRepository.getOne(
                {_id: params.parentId}
            )
            if(!parentCommentExist) throw new NotFoundException("comment not found")
        }
        // if yes create comment 
        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params, 
            userId,
            postId : params.postId || parentCommentExist?.postId
        })
    }

    async getAll(params:any){
        // params >> postId , parentId 
        const comments = await this.commentRepository.getAll({
            postId : params.postId,
            parentId : params.parentId
        })
        if(!comments) throw new NotFoundException("no comments");
        return comments;
    }

    async delete(id:Types.ObjectId, userId: Types.ObjectId){
        //check comment exist 
        const commentExist = await this.commentRepository.getOne(
            {_id: id},
            {},
            {populate: [{path:"postId"}]} 
        )
        if(!commentExist) throw new NotFoundException("comment not found")
        // check if author of comment or post to delete
        // check comment author
        let commentAuthor = await commentExist.userId.toString(); 

        // check post author 
        let postAuthor = await (commentExist.postId as IPost[])[0]?.userId.toString(); 

        if(![postAuthor, commentAuthor].includes(userId.toString())){ //    OR    if(userId != commentAuthor && userId != postAuthor){
            throw new UnAuthorizedException("you are not allowed to delete this comment")
        }

        // delete comment w 3amltlha pre hook lw fe replies hayms7haaa
        await this.commentRepository.deleteOne({ _id : id })
    }

    // gql 
    async getComment(commentId : Types.ObjectId){
        return await this.commentRepository.getOne({_id : commentId},{},
            { populate: 
                [ 
                    {path:"userId"},
                    {path :"postId", populate : [{path : "userId"}]}  
                ]
            })  
    }


    async update(commentId: Types.ObjectId, userId: Types.ObjectId, content: string){
        // check comment exist
        const commentExist = await this.commentRepository.getOne({ _id: commentId });
        if(!commentExist) throw new NotFoundException("comment not found");
        
        // check if author of comment 
        if(commentExist.userId.toString() !== userId.toString()){
            throw new UnAuthorizedException("you can only edit your own comments");
        }

        // update comment
        return await this.commentRepository.updateOne(
            { _id: commentId },
            { content }
        );
    }

}


export default new CommentService(new PostRepository(), new CommentRepository())