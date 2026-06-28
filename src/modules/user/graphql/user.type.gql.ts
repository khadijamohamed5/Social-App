import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
//types of graphql
export const UserTypeGql = new GraphQLObjectType({
    name : "UserType",
    fields : {
        _id : {type : GraphQLID},   
        userName : {type : GraphQLString}, 
        email : {type : GraphQLString}, 
        password : {type : GraphQLString},  
        phoneNumber : {type : GraphQLString},  
        role : {type : GraphQLString},
        provider : {type : GraphQLString},
        gender : {type : GraphQLString},
        profilePic : {type : GraphQLString}
    }
})