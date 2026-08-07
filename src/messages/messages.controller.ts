import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Delete,
    Param
} from "@nestjs/common";


import { MessagesService } from "./messages.service";



@Controller("messages")
export class MessagesController {



constructor(
    private readonly messagesService: MessagesService
){}






// ============================
// GET MESSAGES
// ============================


@Get()

getMessages(
    @Query("chatId") chatId:string
){


return this.messagesService.getMessages(

    Number(chatId)

);


}









// ============================
// UNREAD
// ============================


@Get("unread")

getUnread(
    @Query("userId") userId:string
){


return this.messagesService.getUnread(

    Number(userId)

);


}









// ============================
// CREATE MESSAGE
// ============================
// ВАЖНО:
// Сейчас текстовые сообщения идут через SOCKET.
// Этот POST нужен только для старых запросов,
// файлов и совместимости.
// ============================


@Post()

createMessage(
    @Body() body:any
){



return this.messagesService.createMessage({

    chatId:
    Number(body.chatId),


    senderId:
    Number(body.senderId),


    text:
    body.text,


    type:
    body.type,


    fileUrl:
    body.fileUrl,


    fileName:
    body.fileName,


    fileSize:
    body.fileSize


});



}









// ============================
// DELETE MESSAGE
// ============================


@Delete(":id")

deleteMessage(
    @Param("id") id:string
){


return this.messagesService.deleteMessage(

    Number(id)

);


}



}