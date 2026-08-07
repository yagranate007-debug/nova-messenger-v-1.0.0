import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService {


    constructor(
        private prisma: PrismaService
    ) {}





    // все пользователи

    async findAll(){


        return this.prisma.user.findMany({


            select:{


                id:true,

                username:true,

                avatar:true,

                emojiAvatar:true,

                bio:true,

                createdAt:true


            }


        });


    }








    // поиск пользователей

    async search(query:string){


        if(!query){

            return [];

        }



        return this.prisma.user.findMany({


            where:{


                OR:[


                    {

                        username:{

                            contains:query,

                            mode:"insensitive"

                        }

                    },


                    {

                        email:{

                            contains:query,

                            mode:"insensitive"

                        }

                    }


                ]


            },


            select:{


                id:true,

                username:true,

                avatar:true,

                emojiAvatar:true,

                bio:true


            },


            take:20


        });



    }









    // обновление профиля

    async updateUser(
        id:number,
        body:any
    ){



        const user = await this.prisma.user.findUnique({


            where:{


                id:id


            }


        });




        if(!user){


            throw new Error(
                "Пользователь не найден"
            );


        }






        if(body.username){



            const exists = await this.prisma.user.findFirst({


                where:{


                    username:body.username,


                    NOT:{


                        id:id


                    }


                }


            });





            if(exists){


                throw new Error(
                    "Это имя пользователя уже занято"
                );


            }


        }







        return this.prisma.user.update({



            where:{


                id:id


            },



            data:{



                username:
                body.username ?? user.username,



                bio:
                body.bio ?? user.bio,



                avatar:
                body.avatar ?? user.avatar,



                emojiAvatar:
                body.emojiAvatar ?? user.emojiAvatar



            },



            select:{



                id:true,


                username:true,


                avatar:true,


                emojiAvatar:true,


                bio:true,


                createdAt:true



            }



        });



    }












    // изменение эмодзи аватара


    async updateEmojiAvatar(

        id:number,

        emojiAvatar:string

    ){



        const allowedEmoji = [


            "🙂",
            "😎",
            "🔥",
            "🚀",
            "💎",
            "👑",
            "🐺",
            "🐱",
            "🐶",
            "🦊",
            "👽",
            "🤖",
            "🎸",
            "🎧",
            "⚡",
            "🌙",
            "⭐",
            "❤️"


        ];





        if(!allowedEmoji.includes(emojiAvatar)){


            throw new Error(
                "Такой эмодзи запрещён"
            );


        }







        const user = await this.prisma.user.findUnique({


            where:{


                id:id


            }


        });





        if(!user){


            throw new Error(
                "Пользователь не найден"
            );


        }








        return this.prisma.user.update({



            where:{


                id:id


            },



            data:{


                emojiAvatar:emojiAvatar


            },



            select:{


                id:true,

                username:true,

                avatar:true,

                emojiAvatar:true,

                bio:true


            }



        });



    }



}