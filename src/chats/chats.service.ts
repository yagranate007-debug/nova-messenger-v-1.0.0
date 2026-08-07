import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class ChatsService {


    constructor(
        private prisma: PrismaService
    ) {}





    async createChat(
        user1Id:number,
        user2Id:number
    ){


        user1Id = Number(user1Id);

        user2Id = Number(user2Id);



        if(
            !user1Id ||
            !user2Id ||
            isNaN(user1Id) ||
            isNaN(user2Id)
        ){

            throw new Error(
                "Неверный ID пользователя"
            );

        }



        if(user1Id === user2Id){

            throw new Error(
                "Нельзя создать чат с самим собой"
            );

        }





        const exists =
        await this.prisma.chat.findFirst({


            where:{


                OR:[


                    {
                        user1Id:user1Id,
                        user2Id:user2Id
                    },


                    {
                        user1Id:user2Id,
                        user2Id:user1Id
                    }


                ]


            }


        });






        if(exists){

            return exists;

        }







        return this.prisma.chat.create({


            data:{


                user1Id:user1Id,

                user2Id:user2Id


            },


            include:{


                user1:true,

                user2:true


            }


        });



    }









    async getUserChats(
        userId:number
    ){



        userId = Number(userId);





        if(
            !userId ||
            isNaN(userId)
        ){

            throw new Error(
                "Неверный ID пользователя"
            );

        }






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



            include:{



                user1:{


                    select:{


                        id:true,

                        username:true,

                        avatar:true,

                        emojiAvatar:true,

                        bio:true


                    }


                },



                user2:{


                    select:{


                        id:true,

                        username:true,

                        avatar:true,

                        emojiAvatar:true,

                        bio:true


                    }


                },



                messages:{


                    orderBy:{


                        createdAt:"desc"


                    },


                    take:1


                }



            },



            orderBy:{


                updatedAt:"desc"


            }



        });










        return chats.map(chat=>{



            const user =

            chat.user1Id === userId

            ?

            chat.user2

            :

            chat.user1;





            const lastMessage =
            chat.messages[0];






            return {



                id:chat.id,


                user1Id:chat.user1Id,


                user2Id:chat.user2Id,



                username:user.username,


                avatar:user.avatar,


                emojiAvatar:user.emojiAvatar,


                bio:user.bio,




                user:{


                    id:user.id,


                    username:user.username,


                    avatar:user.avatar,


                    emojiAvatar:user.emojiAvatar,


                    bio:user.bio


                },





                lastMessage:


                lastMessage?.text

                ||

                (
                    lastMessage?.fileUrl
                    ?

                    "📎 Файл"

                    :

                    "Нет сообщений"
                ),




                lastMessageId:


                lastMessage?.id || null,





                updatedAt:


                lastMessage?.createdAt

                ||

                chat.updatedAt



            };



        });



    }



}