import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoolqService } from './coolq.service';

@Controller('coolq')
export class CoolqController {
    constructor(readonly coolqService: CoolqService) {}
    @Post()
    receiveMsg(@Body() qqMsg) {
        /* 接收机器人发过来的消息数据 */
        switch (qqMsg.post_type) {
            case 'message':
                this.coolqService.messageType(qqMsg)
                break;
        }
    }
    @Get()
    index() {
        return '行行行，访问到了嘛，给你问'
    }
}
