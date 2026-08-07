import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";



@Injectable()
export class MessagesService {



constructor(
    private readonly prisma: PrismaService
){}









// ============================
// GET MESSAGES
// ============================


async getMessages(chatId:number){



if(!chatId){

    return [];

}





return this.prisma.message.findMany({


where:{

    chatId

},



orderBy:{

    createdAt:"asc"

},



include:{


sender:{


select:{


id:true,

username:true,

emojiAvatar:true


}


}



}



});



}












// ============================
// CREATE MESSAGE
// ============================
// Используется только для файлов
// и старых запросов.
// Текст идёт через Gateway.
// ============================


async createMessage(data:any){



return this.prisma.message.create({



data:{


chatId:Number(data.chatId),


senderId:Number(data.senderId),


text:data.text ?? "",


type:data.type ?? "text",


fileUrl:data.fileUrl ?? null,


fileName:data.fileName ?? null,


fileSize:data.fileSize ?? null,


status:"SENT"



},




include:{


sender:{


select:{


id:true,

username:true,

emojiAvatar:true


}



}



}



});



}











// ============================
// DELETE
// ============================


async deleteMessage(id:number){



return this.prisma.message.delete({


where:{


id:Number(id)


}


});



}











// ============================
// UNREAD
// ============================


async getUnread(userId:number){



const chats =

await this.prisma.chat.findMany({



where:{


OR:[


{

user1Id:userId

},


{

user2Id:userId

}


]


},




select:{


id:true


}



});






const chatIds =

chats.map(

chat=>chat.id

);






const messages =

await this.prisma.message.findMany({



where:{


chatId:{


in:chatIds


},



senderId:{


not:userId


},



status:{


not:"READ"


}



},



select:{


chatId:true


}



});







const result:any={};






messages.forEach(msg=>{



result[msg.chatId] =

(result[msg.chatId] || 0)+1;



});






return result;



}



}