import { ApiClient } from "../../../apiClient";
import axios from 'axios' // axios应该是声明了d.ts
import * as request from 'request' // request就没声明，真是个噢买尬的事，曰
import * as cheerio from 'cheerio' // cheerio就没声明，真是个噢买尬的事，曰
import { IQQMsg } from "src/coolq/interface/IQQMsg";
export class Prose extends ApiClient {
    protected rules: RegExp = /上文|文来|上菜|文捏马|散文|看文|打散文|打文|随机文/ // 验证触发散文规则
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
        let size: number = +this.qqMsg.message.match(/\d+/) // 取出搜集到的数字，如果搜不到则取个100
        if (size > 0) {
            size = size > 4000 ? 4000 : size // 如果取出的数字大于4000，则给它个最大限制4000
            const result: string = await this.climbProse(size)
            this.sendTextMsg(result)
        }
    }

    /**
     * 
     * @param size 字数大小
     */
    public async climbProse(size: number): Promise<string> {
        /* climb随机散文 */
        return new Promise(r => {
            try {
                request.get(`https://meiriyiwen.com/random`, (err, res) => {
                    const bodyStr = res.body.replace(/  |\r|\n/g, '')
                    const $ = cheerio.load(bodyStr)
                    const str = `${$('.article_text').eq(0).text().replace(/\n|　| /g, '').substr(0, size)}\r-----第${~~(Math.random() * 100000)}段-----`
                    r(str)
                })
            } catch (error) {
                console.error('error', error)
                r('Prose模块异常，请联系开发人员')
            }
        })
    }
}