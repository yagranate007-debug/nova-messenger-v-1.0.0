import { 
    Body,
    Controller,
    Get,
    Put,
    Query
} from '@nestjs/common';

import { UsersService } from './users.service';



@Controller('users')
export class UsersController {



    constructor(
        private usersService: UsersService
    ) {}







    // все пользователи

    @Get()
    findAll(){


        return this.usersService.findAll();


    }








    // поиск пользователей

    @Get("search")
    search(


        @Query("query") query?:string,


        @Query("q") q?:string


    ){


        const text = query ?? q ?? "";



        console.log(
            "Поиск:",
            text
        );



        return this.usersService.search(
            text
        );


    }









    // обновление профиля

    @Put("update")
    updateUser(


        @Body() body:any


    ){



        return this.usersService.updateUser(


            body.id,


            body


        );


    }












    // изменение эмодзи аватарки

    @Put("emoji-avatar")
    updateEmojiAvatar(


        @Body() body:any


    ){



        return this.usersService.updateEmojiAvatar(


            body.id,


            body.emojiAvatar


        );



    }







}