// main function run 
import express, { NextFunction, Request, Response } from "express";
import { authRouter, chatRouter, commentRouter, postRouter, requestRouter, userRouter } from "./modules";
import { BadRequestException, NotFoundException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";
import { pipeline} from "node:stream";
import { promisify } from "node:util";
import { s3CloudProvider } from "./common/cloud/S3/init";
import { createHandler } from "graphql-http/lib/use/express";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { PostQueryGql } from "./modules/post/graphql/post.query.gql";
import { UserQueryGql } from "./modules/user/graphql/user.query.gql";
import { isAuthenticatedGql } from "./common/graphql/authentication.gql";
import { CommentQueryGql } from "./modules/comment/graphql/comment.query.gql"
import { PostMutationGql } from "./modules/post/graphql/post.mutation.gql"
import "dotenv/config";

import cors from 'cors'
import { RealtimeGateway } from "./common/realtime-gateway/realtime-gateway";

const piplinePromise = promisify(pipeline)

export function bootstrap(){
    const app = express();
    const port = process.env.PORT || 3000;

    // connection 
    connectDB()
    redisConnect()


    app.use(cors({origin:"*"})) 
    // to parse data 
    app.use(express.json())




    // graphql Query
    let query = new GraphQLObjectType({
        name : "RootQuery",
        fields : {
            ...UserQueryGql,
            ...PostQueryGql,
            ...CommentQueryGql,
        }
    })

    // graphql mutation
    let mutation = new GraphQLObjectType({
        name : "RootMutation",
        fields : {
            ...PostMutationGql 
        }
    })

    let schema = new GraphQLSchema({
        query,
        mutation
    })
    app.all('/graphql', createHandler({
        schema ,
        context : isAuthenticatedGql
    }))


    
    
    // to upload file in S3 cloud
    app.get('/upload/*path', async (req : Request, res : Response, next : NextFunction)=>{
        let key = (req.params.path as string[]).join('/')
        const fileExist = await s3CloudProvider.getFile(key); // read stream
        if(!fileExist) throw new NotFoundException("file not found")
 
        await piplinePromise(fileExist, res) // res >> write stream >> 3amlt pipeline 3alshan a7l el moshkela dee
    })

    // routing 
    app.use('/auth',authRouter)
    app.use('/post',postRouter)
    app.use('/comment',commentRouter)
    app.use('/friend-request', requestRouter)
    app.use('/user', userRouter)
    app.use('/chat', chatRouter)


    app.use((req: Request, res: Response) => {
        return res.status(404).json({
            message: "Route not found",
            success: false
        });
    });

    // Global error handler " 4 postional argu"
    app.use((error : Error, req : Request, res : Response, next : NextFunction)=>{
        return res.status((error.cause as number) || 500).json({
            message : error.message,
            success : false, 
            details : // if
            error instanceof BadRequestException? 
            error.details // if yes 
            : undefined, // if no 
        })
    })



    const httpServer = app.listen(port, ()=>{
        console.log("application is running on port ", port)
    })
    const realTimeGateway = new RealtimeGateway(httpServer)
    realTimeGateway.establishConnection()
}