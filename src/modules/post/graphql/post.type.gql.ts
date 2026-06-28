import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt} from "graphql";
import { UserTypeGql } from "../../user/graphql/user.type.gql";

export const PostTypeGql = new GraphQLObjectType({
    name: "PostType",

    fields: {
        id: { type: GraphQLID },
        content : { type: GraphQLString },
        attachments : { type: new GraphQLList(GraphQLString)},
        reactionsCount : { type: GraphQLInt },
        commentsCount : { type: GraphQLInt },
        sharesCount : { type: GraphQLInt },
        user : { 
            type : UserTypeGql, 
            resolve: (parent:any)=>{
                return parent.userId  // p asm tany 
            }
        }
    }
})