import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

import { PrismaService } from "./prisma/prisma.service";



const onlineUsers = new Map<number, number>();


// защита от двойной отправки
const sendingMessages = new Set<string>();




@WebSocketGateway({

    cors:{

        origin:[
            "https://nova-messenger-frontend-v-100-production.up.railway.app",
            "https://nova-messenger.ru"
        ],

        credentials:true

    }

})



export class ChatGateway

implements OnGatewayConnection, OnGatewayDisconnect {



@WebSocketServer()

server!:Server;





constructor(

    private prisma:PrismaService

){}









// ==========================
// CONNECT
// ==========================


async handleConnection(client:Socket){



const userId = Number(

    client.handshake.auth.userId

);




if(!userId){

    client.disconnect();

    return;

}




client.data.userId = userId;



client.join(

    `user_${userId}`

);




onlineUsers.set(

    userId,

    (onlineUsers.get(userId) || 0) + 1

);




this.server.emit(

    "onlineUsers",

    Array.from(
        onlineUsers.keys()
    )

);




this.server.emit(

    "userOnline",

    {
        userId
    }

);



console.log(

    "ONLINE:",

    userId

);



}









// ==========================
// DISCONNECT
// ==========================


handleDisconnect(client:Socket){



const userId = Number(

    client.data.userId

);




if(!userId)

return;





const count =

onlineUsers.get(userId) || 0;





if(count <= 1){



    onlineUsers.delete(userId);



    this.server.emit(

        "userOffline",

        {
            userId
        }

    );


}

else{


    onlineUsers.set(

        userId,

        count - 1

    );


}





this.server.emit(

    "onlineUsers",

    Array.from(
        onlineUsers.keys()
    )

);





console.log(

    "OFFLINE:",

    userId

);


}












// ==========================
// SEND MESSAGE
// ==========================


@SubscribeMessage("sendMessage")

async sendMessage(

@MessageBody() body:any

){



console.log(

"NEW MESSAGE EVENT",

body

);






const key =

`${body.chatId}_${body.senderId}_${body.text}`;





if(
sendingMessages.has(key)
){

console.log(

"DUPLICATE BLOCKED",

key

);


return;

}





sendingMessages.add(key);





setTimeout(()=>{


sendingMessages.delete(key);


},1000);








try{



const saved =

await this.prisma.message.create({


data:{


chatId:Number(body.chatId),


senderId:Number(body.senderId),


text:body.text ?? "",


type:body.type ?? "text",


fileUrl:body.fileUrl ?? null,


fileName:body.fileName ?? null,


fileSize:body.fileSize ?? null,


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









const chat =

await this.prisma.chat.findUnique({

where:{

id:Number(body.chatId)

}


});






if(!chat){

console.log(

"CHAT NOT FOUND"

);


return;

}







const users = new Set([


chat.user1Id,


chat.user2Id


]);









users.forEach(userId=>{


this.server

.to(

`user_${userId}`

)

.emit(

"newMessage",

saved

);



});








console.log(

"SAVED MESSAGE:",

saved.id

);






}

catch(error){


console.log(

"SEND MESSAGE ERROR",

error

);



}



}











// ==========================
// CHECK ONLINE
// ==========================


@SubscribeMessage("checkOnline")

checkOnline(

@MessageBody() data:any

){



const userId = Number(

data.userId

);





return {


userId,


online:

onlineUsers.has(userId)



};



}








// ============================
// DELETE MESSAGE REALTIME
// ============================

@SubscribeMessage("deleteMessage")
async deleteMessage(
    @MessageBody() data:any
){

try{


const messageId =
Number(data.messageId);



const deleted =
await this.prisma.message.delete({

where:{
    id:messageId
}


});





const chat =
await this.prisma.chat.findUnique({

where:{
    id:deleted.chatId
}

});



if(!chat)
return;





const users = [

chat.user1Id,

chat.user2Id

];





users.forEach(id=>{


this.server
.to(`user_${id}`)
.emit(

"messageDeleted",

{

messageId

}

);


});





console.log(
"DELETE REALTIME:",
messageId
);



}

catch(error){


console.log(
"DELETE ERROR",
error
);


}



}



// ==========================
// READ MESSAGE
// ==========================


@SubscribeMessage("readMessage")


async readMessage(

@MessageBody() data:any

){



try{



const message =

await this.prisma.message.update({


where:{


id:Number(data.messageId)


},



data:{


status:"READ"


}


});







this.server

.to(

`user_${message.senderId}`

)

.emit(

"messageRead",

{


messageId:message.id,


status:"READ"


}

);





}

catch(error){


console.log(

"READ ERROR",

error

);


}



}



}