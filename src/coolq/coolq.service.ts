import { Injectable } from '@nestjs/common';
import { Novel } from './module/msgType/message/novel';
import { TextCodQuery } from './module/msgType/message/textCodQuery';
import { Translation } from './module/msgType/message/translation';
import { Weather } from './module/msgType/message/weather';
@Injectable()
export class CoolqService {
    messageType(qqMsg) {
        new Translation(qqMsg) // 翻译模块
        new Weather(qqMsg) // 天气模块
        new Novel(qqMsg) // 小说模块
        new TextCodQuery(qqMsg) // 文字编码查询模块
    }
}
