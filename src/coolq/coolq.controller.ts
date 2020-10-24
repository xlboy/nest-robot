import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoolqService } from './coolq.service';
import { IQQMsg } from './interface/IQQMsg';
import axios from 'axios'
@Controller('coolq')
export class CoolqController {
    constructor(readonly coolqService: CoolqService) { }
    @Post()
    public receiveMsg(@Body() qqMsg: IQQMsg) {
        /* 接收机器人发过来的消息数据 */
        switch (qqMsg.post_type) {
            case 'message':
                // axios.post('http://6a4hg2.natappfree.cc', { ...qqMsg })
                this.coolqService.messageType(qqMsg)
                break;
        }
    }
    @Get()
    public index() {
        return '行行行，访问到了嘛，给你问'
    }
}
