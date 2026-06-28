import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { UserTypeGql } from "../../user/graphql/user.type.gql";
import { PostTypeGql } from "../../post/graphql/post.type.gql";
//types of graphql
export const CommentTypeGql = new GraphQLObjectType({
    name : "CommentType",
    fields : {
        user : { 
            type : UserTypeGql, 
            resolve: (parent:any)=>{
                return parent.userId  
            }
        },
        post : { 
            type : PostTypeGql, 
            resolve: (parent:any)=>{
                return parent.postId  
            }
        }, 
        content : { type : GraphQLString},
        attachment : { type : GraphQLString},
        mention : { type : new GraphQLList(UserTypeGql)},
        reactionsCount : {type : GraphQLInt}
    }
})