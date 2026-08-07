import { Injectable } from "@nestjs/common";
import { Resend } from "resend";


@Injectable()
export class MailService {


    private resend: Resend;



    constructor(){


        const key = process.env.RESEND_API_KEY;



        console.log(
            "RESEND KEY:",
            key ? "Есть" : "Нет"
        );



        if(!key){

            throw new Error(
                "RESEND_API_KEY не найден"
            );

        }



        this.resend = new Resend(key);


    }







    async sendVerifyCode(
        email:string,
        code:string
    ){


        try{


            console.log(
                "SEND VERIFY:",
                email,
                code
            );





            const response =

            await this.resend.emails.send({



                from:

                "NOVA 🚀 <no-reply@nova-messenger.ru>",



                to:[

                    email

                ],



                replyTo:

                "no-reply@nova-messenger.ru",




                subject:

                "Код подтверждения NOVA",





                html:



`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

</head>


<body style="
margin:0;
padding:0;
background:#050b16;
font-family:Arial,sans-serif;
">


<div style="
max-width:600px;
margin:40px auto;
background:#101827;
padding:40px;
border-radius:25px;
text-align:center;
color:white;
">


<h1 style="
color:#4da6ff;
font-size:42px;
">

NOVA 🚀

</h1>



<h2>
Подтверждение почты
</h2>



<p style="
color:#9caec4;
">

Введите этот код:

</p>



<div style="
margin:30px auto;
background:#1c2b45;
padding:20px;
border-radius:15px;
font-size:42px;
font-weight:bold;
letter-spacing:12px;
">


${code}


</div>




<p style="
color:#9caec4;
">

Код действует 15 минут.

</p>



<p style="
margin-top:40px;
font-size:12px;
color:#64748b;
">

NOVA Messenger

</p>



</div>


</body>

</html>

`



            });







            console.log(
                "RESEND RESPONSE:",
                JSON.stringify(
                    response,
                    null,
                    2
                )
            );







            if(response.error){


                console.log(
                    "RESEND ERROR:",
                    response.error
                );


                throw new Error(
                    response.error.message
                );


            }







            console.log(
                "EMAIL SENT ID:",
                response.data?.id
            );






            return {


                success:true,


                id:
                response.data?.id


            };





        }



        catch(error:any){


            console.log(
                "MAIL ERROR:",
                error.message
            );



            throw error;


        }


    }


}