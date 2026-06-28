import { Server, Socket } from "socket.io"
import { Server as httpServer } from "node:http"  // uninstall
import { ACCESS_TOKEN_SECRET } from "../../config";
import { verify } from "jsonwebtoken";
import { ICacheProvider } from "../cache/cache.interface";
import { redisCacheProvider } from "../cache/redis/init";

export class RealtimeGateway{
    private readonly _io : Server;
    private readonly cacheProvider : ICacheProvider;

    constructor(server : httpServer){
        this.cacheProvider = redisCacheProvider
        this._io = new Server(server,{ cors : { origin : "*"}})
        
    }

    public establishConnection(){
        this._io.use((socket : Socket, next : any)=>{
            try {
                socket.data = verify(socket.handshake.auth.token, ACCESS_TOKEN_SECRET) // mn el FE
                next()
            } catch (error) {
                next(error) // emit event error ll FE 
            }
        })

        // event to check connection. 
        this._io.on('connection', async (socket : Socket)=>{
            let socketIdLoginUser = `socketIdLoginUser:${socket.data.id}`
            console.log('new connection',socket.id);
            // socket.data.id >> userId >> loginUser


            // add socket id to login user (cache)
            await this.cacheProvider.addToSet(socketIdLoginUser, socket.id) // key , value
            const socketId = await this.cacheProvider.getAllFromSet(socketIdLoginUser)

            socket.on('disconnect', async () =>{
                await this.cacheProvider.rmSet(socketIdLoginUser, socket.id)
                console.log('disconnect',socket.id)
            })
        })
    }

    public get io():Server{
        
        return this._io
    }
    
}

