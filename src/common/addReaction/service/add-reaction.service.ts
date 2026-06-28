import { Types } from "mongoose"
import { AddReactionDto } from "../dto"
import { BadRequestException, NotFoundException } from "../../utils"
import { ON_MODEL } from "../../enums"
import { UserReactionRepository } from "../../../DB/models/user-reaction/user-reaction.repository"
import { PostRepository } from "../../../DB/models/post/post.repository"
import { CommentRepository } from "../../../DB/models/comment/comment.repository"

function toModel(collectionName :string){
    switch(collectionName){
        case "posts":
            return ON_MODEL.Post;
        case "comments":
            return ON_MODEL.Comment;
        default: 
            throw new BadRequestException("invalid Collection");
    }
}


export const addReaction = async (
    addReactionDto: AddReactionDto, 
    userId : Types.ObjectId , 
    repo : PostRepository | CommentRepository 
    ) =>{   

    // check doc exist 
    const docExist = await repo.getOne({ _id : addReactionDto.id})
    if(!docExist) throw new NotFoundException(`${repo.model.modelName} not found`)

 
    const collectionName = docExist.collection.name;

    const userReactionRepository = new UserReactionRepository()

    // check user create reation (by user repo >> so get it in constructor)(UserReactionRepository)
    const userRection = await userReactionRepository.getOne({ 
        userId,
        onModel : toModel(collectionName), // post or comment
        refId : addReactionDto.id 
    }) // output null | {}


    // if no reaction ( null ) >> create reation 
    if(!userRection) {
        await userReactionRepository.create({
            userId,
            onModel : toModel(collectionName),
            refId : addReactionDto.id,
            reaction : addReactionDto.reaction
        })
        // add one in react Count 
        repo.updateOne(
            { _id : addReactionDto.id}, // filter 
            { $inc : { reactionsCount : 1}}
        );
        return ;
    }

    // if have reaction 
    // > 1) same react  >> remove react 
    if ( userRection.reaction == addReactionDto.reaction){
        await userReactionRepository.deleteOne({ _id : userRection._id});
        await repo.updateOne(
            { _id : addReactionDto.id},
            { $inc : {reactionsCount : -1}}
        )
        return;
    }
    // > 2) different react >> update react 
    await userReactionRepository.updateOne(
        {_id : userRection._id},
        { reaction : addReactionDto.reaction}
    )
    return;
}