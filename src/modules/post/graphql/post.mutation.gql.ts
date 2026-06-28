import postService from "../post.service";
import { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLBoolean} from "graphql";
import { Types }  from "mongoose"
import { PostTypeGql } from "./post.type.gql";
import { UnAuthorizedException } from "../../../common";
import { isValidGql } from "../../../common/graphql/isValid.gql";
import { createPostSchema, updatePostSchema } from "../post.schema";

export const PostMutationGql = {
    addPost :{
        type: PostTypeGql,
        args : { // act as req.body    // optional 
            content : {type: new GraphQLNonNull(GraphQLString)},
            attachments : { type: new GraphQLList(GraphQLString)},
        },
        resolve: async (parent: any, args: any, context: any)=>{ // 3 postional arg (parent, args, context)
            if (!context.user) {
                throw new UnAuthorizedException("login first");
            }
            const validatedData = await isValidGql(createPostSchema, args);
            return await postService.create(validatedData, context.user._id)
        }
    },

    updatePost : {
        type : PostTypeGql,
        args : { 
            content : {type : GraphQLString},
            attachments : { type: new GraphQLList(GraphQLString)},
            postId : {type :new GraphQLNonNull(GraphQLString)} 
        },
        resolve: async (parent: any, args: any, context: any) => {
            if (!context.user) throw new UnAuthorizedException("login first");

            const validatedData = await isValidGql(updatePostSchema, args);

            return await postService.updatePost(
                new Types.ObjectId(args.postId),
                context.user._id,
                validatedData
            );
        }
    },

    deletePost : {
        type : GraphQLBoolean, // byrag3 atmsah wala l2
        args: {
            postId : {type : new GraphQLNonNull(GraphQLString)}
        },
        resolve : async (parent: any, args: {postId : string}, context: any)=>{
            if (!context.user) throw new UnAuthorizedException("login first");
    
            return await postService.deletePost(
                new Types.ObjectId(args.postId),
                context.user._id
            );
        }
    }
}