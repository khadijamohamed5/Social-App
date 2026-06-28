import { Types } from "mongoose";
import { FriendRequestRepository } from "../../DB/models/friends-request/friends-request.repository";
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common";
import { UserFriendRepository } from "../../DB/models/user-friend/user-friend.repository";
import { send } from "process";

class FriendRequestService {
    constructor(
        private readonly friendRequestRepository:FriendRequestRepository,
        private readonly userFriendRepository:UserFriendRepository
        ){}

    async sendRequest(senderId : Types.ObjectId, receiverId : Types.ObjectId){  // senderId >> user >> token 
        // check sender != recevier ( ab3t l nafsy )
        if(senderId.toString()==receiverId.toString())throw new BadRequestException("not allowed to send request to yourself")

        // check user friend
        const userAlreadyFriend = await this.userFriendRepository.getOne({
            $or:[
                {user: senderId, friend: receiverId},
                {user: receiverId, friend: senderId}
            ]
        })
        if(userAlreadyFriend) throw new BadRequestException("you are already friends!")

        // check have request already 
        const requestExist = await this.friendRequestRepository.getOne({
            $or: [
                {sender: senderId, receiver: receiverId},
                {sender : receiverId, receiver: senderId}
            ]
        })
        if(requestExist) throw new ConflictException("Request already exists")

        // if no , create request 
        await this.friendRequestRepository.create({
            sender : senderId,
            receiver : receiverId
        })

    }

    async acceptRequest(userId: Types.ObjectId, requestId :Types.ObjectId ){
        // 1) check req exist
        const requestExist = await this.friendRequestRepository.getOne({ _id: requestId})
        if(!requestExist) throw new NotFoundException("Request not found")
        // 2) if yes, check receiverId accept req
        if(requestExist.receiver.toString() != userId.toString()) throw new UnAuthorizedException("you are not allowed to accept request") // Or if (!requestExist.receiver.equals(userId))
        // 3) delete from req table 
        await this.friendRequestRepository.deleteOne({ _id : requestId})
        // 4) create user friend table 
        await this.userFriendRepository.create({
            user : userId, // id el receiver >> l2n hwa el accept el req f hwa el create b2a 
            friend : requestExist.sender 
        })
    }

    async declineOrCancelRequest(userId: Types.ObjectId, requestId :Types.ObjectId ){
        // 1) check req exist
        const requestExist = await this.friendRequestRepository.getOne({ _id: requestId})
        if(!requestExist) throw new NotFoundException("Request not found")

        // 2) check sender or recevier === userId
        if(!userId.equals(requestExist.sender) && !userId.equals(requestExist.receiver)){
            throw new UnAuthorizedException("you are not allowed to decline or cancel request")
        }

        // delete from request tabel 
        await this.friendRequestRepository.deleteOne({_id: requestId})
    }


    async removeFriend(userId: Types.ObjectId, friendId :Types.ObjectId ){ 
        // check if you don't delete yourself
        if(userId.equals(friendId)) throw new BadRequestException("cannot remove yourself from friends")
        // delete by condition if userId or friendId is match 
        const {deletedCount} = await this.userFriendRepository.deleteOne({  // deleteOne return Acknowldge and deleteCount
            $or:
            [
                {user: userId, friend : friendId},
                {user: friendId, friend: userId}
            ]
        })
        if(deletedCount == 0) throw new NotFoundException("you are not friends!")
    }

    async getMyRequests(userId: Types.ObjectId){
        return await this.friendRequestRepository.getAll(
            { receiver: userId },
            {},
            { populate: [{ path: "sender", select: "userName profilePic email" }] } 
        );
    }
}



export default new FriendRequestService(new FriendRequestRepository(), new UserFriendRepository())