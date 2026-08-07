import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';


import {
    FileInterceptor
} from '@nestjs/platform-express';


import {
    diskStorage
} from 'multer';


import {
    extname
} from 'path';


import { UploadService } from './upload.service';



@Controller('upload')
export class UploadController {


constructor(
    private uploadService: UploadService
){}





@Post()


@UseInterceptors(

    FileInterceptor(

        'file',

        {

            storage: diskStorage({

                destination: './uploads',


                filename: (

                    req,

                    file,

                    cb

                )=>{


                    const uniqueName =

                    Date.now()

                    +

                    extname(
                        file.originalname
                    );



                    cb(
                        null,
                        uniqueName
                    );


                }


            })


        }

    )

)



upload(

    @UploadedFile()

    file:any

){



    // если файл не отправили

    if(!file){


        throw new BadRequestException(

            "Файл не выбран"

        );


    }




    return this.uploadService.saveFile(file);


}



}