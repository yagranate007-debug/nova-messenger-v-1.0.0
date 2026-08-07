import {
    Controller,
    Post,
    Body,
    Get,
    Query
} from '@nestjs/common';

import { ChatsService } from './chats.service';



@Controller('chats')
export class ChatsController {



    constructor(
        private chatsService: ChatsService
    ) {}







    @Post('create')
    create(
        @Body() body:any
    ){



        const user1Id = Number(
            body.user1Id 
            ??
            body.userId
            ??
            body.id
        );



        const user2Id = Number(
            body.user2Id
            ??
            body.friendId
            ??
            body.targetId
        );





        console.log(
            "Создание чата:",
            {
                user1Id,
                user2Id
            }
        );






        return this.chatsService.createChat(

            user1Id,

            user2Id

        );



    }








    @Get()
    getChats(
        @Query('userId') userId:string
    ){



        const id = Number(userId);




        console.log(
            "Получение чатов пользователя:",
            id
        );





        return this.chatsService.getUserChats(

            id

        );



    }



}