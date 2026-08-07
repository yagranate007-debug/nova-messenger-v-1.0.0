import { AppController } from "./app.controller";

import {
    Module
} from "@nestjs/common";


import {
    PrismaModule
} from "./prisma/prisma.module";


import {
    AuthModule
} from "./auth/auth.module";


import {
    UsersModule
} from "./users/users.module";


import {
    ChatsModule
} from "./chats/chats.module";


import {
    MessagesModule
} from "./messages/messages.module";


import {
    MailModule
} from "./mail/mail.module";


import {
    SocketModule
} from "./socket/socket.module";


import {
    ScheduleModule
} from "@nestjs/schedule";


import {
    CleanupModule
} from "./cleanup/cleanup.module";


import {
    UploadModule
} from "./upload/upload.module";




@Module({


    controllers:[
    AppController
],

imports:[


PrismaModule,


MailModule,


AuthModule,


UsersModule,


ChatsModule,


MessagesModule,


UploadModule,


ScheduleModule.forRoot(),


CleanupModule,


SocketModule



]


})


export class AppModule {}