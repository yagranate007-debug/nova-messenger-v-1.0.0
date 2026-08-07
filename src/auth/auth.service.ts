import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {


constructor(

    private prisma: PrismaService,

    private mailService: MailService

){}






async register(

    email:string,

    username:string,

    password:string

){


console.log(
    "REGISTER START:",
    email,
    username
);




console.log(
    "CHECK DATABASE..."
);





const existingEmail =

await this.prisma.user.findUnique({

    where:{
        email
    }

});





const existingUsername =

await this.prisma.user.findUnique({

    where:{
        username
    }

});






console.log(
    "EMAIL RESULT:",
    existingEmail
);



console.log(
    "USERNAME RESULT:",
    existingUsername
);







// если такой email уже есть

if(existingEmail){



    // но почта не подтверждена

    if(!existingEmail.isVerified){



        const code =

        Math.floor(

            100000 +

            Math.random()*900000

        ).toString();






        await this.prisma.user.update({

            where:{

                id:existingEmail.id

            },


            data:{


                verifyCode:code,


                verifyExpires:

                new Date(

                    Date.now()

                    +

                    15*60*1000

                )

            }


        });







        console.log(
            "OLD USER NEW CODE:",
            code
        );




        console.log(
            "BEFORE MAIL"
        );




        await this.mailService.sendVerifyCode(

            email,

            code

        );




        console.log(
            "AFTER MAIL"
        );




        return {

            message:
            "Новый код отправлен"

        };


    }





    throw new Error(

        "Этот email уже используется"

    );


}









// если username занят

if(existingUsername){


    throw new Error(

        "Этот username уже занят"

    );


}









console.log(
    "CREATE PASSWORD HASH"
);




const hash =

await bcrypt.hash(

    password,

    10

);






const code =

Math.floor(

    100000 +

    Math.random()*900000

).toString();






console.log(

    "NEW VERIFY CODE:",

    code

);







const user =

await this.prisma.user.create({


    data:{


        email,


        username,


        password:hash,


        isVerified:false,


        verifyCode:code,


        verifyExpires:

        new Date(

            Date.now()

            +

            15*60*1000

        )


    }


});






console.log(

    "USER CREATED:",

    user.id

);






console.log(
    "BEFORE MAIL"
);





await this.mailService.sendVerifyCode(

    email,

    code

);





console.log(
    "AFTER MAIL"
);







return {


    message:

    "Код отправлен на почту",



    user:{


        id:user.id,


        email:user.email,


        username:user.username


    }


};

}












async verifyEmail(

    email:string,

    code:string

){



console.log(

    "VERIFY:",

    email,

    code

);





const user =

await this.prisma.user.findUnique({

    where:{

        email

    }

});







if(!user){


    throw new Error(

        "Пользователь не найден"

    );


}







console.log(

    "USER BEFORE VERIFY:",

    user.isVerified,

    user.verifyCode

);








if(user.isVerified){


    return {

        message:

        "Почта уже подтверждена"

    };


}








if(user.verifyCode !== code){


    throw new Error(

        "Неверный код"

    );


}








if(

    !user.verifyExpires ||

    user.verifyExpires < new Date()

){


    throw new Error(

        "Код истёк"

    );


}








await this.prisma.user.update({

    where:{

        id:user.id

    },


    data:{


        isVerified:true,


        verifyCode:null,


        verifyExpires:null


    }


});







console.log(

    "VERIFY SUCCESS"

);







return {


    message:

    "Почта успешно подтверждена"


};


}









async login(

    email:string,

    password:string

){



console.log(

    "LOGIN:",

    email

);






const user =

await this.prisma.user.findUnique({

    where:{

        email

    }

});






if(!user){


    throw new Error(

        "Пользователь не найден"

    );


}







console.log(

    "VERIFY STATUS:",

    user.isVerified

);







if(!user.isVerified){


    throw new Error(

        "Подтвердите почту"

    );


}








const valid =

await bcrypt.compare(

    password,

    user.password

);







if(!valid){


    throw new Error(

        "Неверный пароль"

    );


}







return {


    success:true,


    id:user.id,


    userId:user.id,


    email:user.email,


    username:user.username,


    avatar:user.avatar,


    bio:user.bio


};


}





}