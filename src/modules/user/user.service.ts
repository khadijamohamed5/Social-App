import { Types } from "mongoose";
import { ICloudProvider } from "../../common/cloud/cloud.interface";
import { s3CloudProvider } from "../../common/cloud/S3/init";
import { UserRepository, userRepository } from "../../DB/models/user/user.repository";
import { NotFoundException } from "../../common";
import { userFriendRepository, UserFriendRepository } from "../../DB/models/user-friend/user-friend.repository";

class UserService{
    constructor(
        private readonly cloudProvider : ICloudProvider,
        private readonly userRepository : UserRepository,
        private readonly userFriendRepository : UserFriendRepository
        ){}

    async uploadProfilePic(file: Express.Multer.File , userId: Types.ObjectId){
        // upload to s3
        const key =  await this.cloudProvider.uploadFile(file,`users/${userId.toString()}`)
        // update in db 
        const user = await this.userRepository.updateOne(
            { _id: userId },
            { profilePic: key },
            { returnDocument : "before"} // hyrga3 el old user 
            )
        if(!user) throw new NotFoundException("user not found!")

        // delete old pic 
        if(user.profilePic) await this.cloudProvider.deleteFile(user.profilePic)
    }

    //gql 
    async getProfile(userId: Types.ObjectId){
        const user = await this.userRepository.getOne({_id:userId})
        const friends = await this.userFriendRepository.getAll(
            {$or : [{user: userId}, {friends : userId}]},
            {},
            {populate :[{path :"user"},{path : "friend"}]}
        )
        // todo groups
        return {user,friends}

    } 

    async updateProfile(userId: Types.ObjectId, data: any){
        const updatedUser = await this.userRepository.updateOne(
            { _id: userId },
            data,
            { returnDocument: "after" } 
        );
        if(!updatedUser) throw new NotFoundException("user not found!");
        return updatedUser;
    }

    async deleteAccount(userId: Types.ObjectId){
        const deletedUser = await this.userRepository.deleteOne({ _id: userId });
        if(!deletedUser) throw new NotFoundException("user not found!");
        return true;
    }
}

export default new UserService(s3CloudProvider, userRepository, userFriendRepository)