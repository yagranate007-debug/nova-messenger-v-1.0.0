import {
Controller,
Get
} from "@nestjs/common";


@Controller()
export class AppController {


@Get()
test(){

    return {
        status:"NOVA API ONLINE",
        time:new Date()
    };

}


}