import { IChat } from "../../../common/interfaces/chat.interface";
import { AbstractRepository } from "../../abstract.repository";
import { Chat } from "./chat.model";

export class ChatRepository extends AbstractRepository<IChat>{
    constructor(){
        super(Chat)
    }
}

export const chatRepository = new ChatRepository();