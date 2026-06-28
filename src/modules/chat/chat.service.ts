import { Types } from "mongoose";
import { chatRepository, ChatRepository } from "../../DB/models/chat/chat.repository";
import { messageRepository, MessageRepository } from "../../DB/models/message/message.repository";
import { BadRequestException, CHAT_TYPE, NotFoundException, UnAuthorizedException } from "../../common";

class ChatService{
    constructor(
        private readonly chatRepository : ChatRepository,
        private readonly messageRepository : MessageRepository
    ){}

    async getChat(userId : Types.ObjectId , loginUser : Types.ObjectId){
        const chat = await this.chatRepository.getOne({
            participants : {$all : [userId, loginUser]}
        })
        if(!chat) throw new NotFoundException("chat not exist!") 
        const messages = await this.getMessage(userId, loginUser, chat._id);
        return {chat, messages}
    }

    private async getMessage(userId : Types.ObjectId, loginUser : Types.ObjectId, chatId : Types.ObjectId){
        const message = await this.messageRepository.getAll({
            $or : [
                {sender : userId},
                {sender : loginUser}
            ],
            chat : chatId
        },{},{limit: 20, sort : {createdAt : -1}
        })
        return message;
    }

    async getAllChats(userId: Types.ObjectId) {
        return await this.chatRepository.getAll(
        {participants: userId},
        {},
        {
            sort: {
                updatedAt: -1
            }
        });
    }

    async createChat(userId: Types.ObjectId, loginUser: Types.ObjectId) {
        if (userId.equals(loginUser)) {
            throw new BadRequestException("You cannot create a chat with yourself.");
        }
        const chatExist = await this.chatRepository.getOne({
            participants: {
                $all: [userId, loginUser]
            },
            chatType: CHAT_TYPE.private
        });
        if (chatExist) return chatExist

        return await this.chatRepository.create({ 
            participants: [loginUser,userId],
            chatType: CHAT_TYPE.private,
        });
    }

    async sendMessage(chatId: Types.ObjectId, sender: Types.ObjectId, content: string) {
        const chat = await this.chatRepository.getOne({_id: chatId});
        if (!chat) throw new NotFoundException("Chat not found");
    
        const isParticipant = chat.participants.some(user =>user.equals(sender));
        if (!isParticipant) throw new UnAuthorizedException("You are not a participant in this chat.");

        return await this.messageRepository.create({
            chat: chatId,
            sender,
            content
        });
    }
}

export default new ChatService(chatRepository, messageRepository) 