import {
    Controller,
    Post,
    Body
} from "@nestjs/common";

import { AuthService } from "./auth.service";


@Controller("auth")
export class AuthController {


    constructor(
        private authService: AuthService
    ) {}




    @Post("register")
    async register(
        @Body() body:any
    ) {


        try {


            return await this.authService.register(

                body.email,

                body.username,

                body.password

            );


        }


        catch(error:any){


            return {

                success:false,

                message:
                    error?.message ??
                    "Ошибка регистрации"

            };


        }


    }






    @Post("login")
    async login(

        @Body() body:any

    ){


        try{


            return await this.authService.login(

                body.email,

                body.password

            );


        }


        catch(error:any){


            return {

                success:false,

                message:
                    error?.message ??
                    "Ошибка входа"

            };


        }


    }






    @Post("verify")
    async verify(

        @Body() body:any

    ){


        try{


            return await this.authService.verifyEmail(

                body.email,

                body.code

            );


        }


        catch(error:any){


            return {

                success:false,

                message:
                    error?.message ??
                    "Ошибка подтверждения"

            };


        }


    }



}