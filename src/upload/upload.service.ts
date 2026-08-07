import { Injectable } from '@nestjs/common';


@Injectable()
export class UploadService {


    saveFile(file:any){


        return {

            filename:file.filename,

            originalName:file.originalname,

            size:file.size,

            type:file.mimetype,

            url:
            `/uploads/${file.filename}`

        };


    }


}