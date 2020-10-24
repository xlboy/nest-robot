import { ApiClient } from "../../../apiClient";
import axios from 'axios'
import { IQQMsg} from "src/coolq/interface/IQQMsg";
export class Novel extends ApiClient {
    protected rules: RegExp = /上说|说来|上油|说捏马|小说|看说|打小说|打说/ // 验证触发小说规则
    constructor(readonly qqMsg: IQQMsg) {
        super(qqMsg)
        this.judgeRules()
    }
    public judgeRules() {
        /* 判断规则是否通过 */
        const { message } = this.qqMsg
        if (this.rules.test(message) && message.length < 15) {
            this.handle() // 规则通过，进来了
        }
    }
    public async handle() {
        /* 规则通过了，就进行处理 */
        let size: number = +this.qqMsg.message.match(/\d+/) || 100 // 取出搜集到的数字，如果搜不到则取个100
        size = size > 4000 ? 4000 : size // 如果取出的数字大于4000，则给它个最大限制4000
        const result: string = await this.climbNovel(size)
        this.sendTextMsg(result)
    }

    /**
     * 
     * @param size 字数大小
     */
    public async climbNovel(size: number): Promise<string> {
        /* 拿东西，进行诶诶啊啊 */
        const url: string = `http://xlboy.cn:8988/getNovel?size=${size}`
        try {
            const { data } = await axios.get(url)
            return data.result || '获取失败'
        } catch (error) {
            console.error('error', error)
            return 'Novel模块异常，请联系开发人员'
        }
    }
}