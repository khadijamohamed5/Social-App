import { IFriendRequest } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { friendRequest } from "./friends-request.model";

export class FriendRequestRepository extends AbstractRepository<IFriendRequest>{
    constructor(){
        super(friendRequest)
    }
}

export const friendRequestRepository = new FriendRequestRepository();