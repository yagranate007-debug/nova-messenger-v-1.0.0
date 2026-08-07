import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {

    const app =
        await NestFactory.create<NestExpressApplication>(
            AppModule
        );


    // SOCKET.IO

    app.useWebSocketAdapter(
        new IoAdapter(app)
    );


    // CORS

    app.enableCors({

        origin:[
            "https://nova-messenger.ru",
            "https://nova-messenger-frontend-v-100-production.up.railway.app"
        ],

        credentials:true

    });



    // UPLOADS

    app.useStaticAssets(

        join(
            process.cwd(),
            "uploads"
        ),

        {
            prefix:"/uploads/"
        }

    );



    // SERVER

    const port =
        Number(process.env.PORT) || 3000;


    await app.listen(
        port,
        "0.0.0.0"
    );


    console.log(
        `SERVER START PORT ${port}`
    );

}


bootstrap();