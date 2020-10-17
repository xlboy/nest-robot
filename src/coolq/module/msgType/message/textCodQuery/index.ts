import { ApiClient } from "../../../apiClient";
import axios from 'axios'
export class TextCodQuery extends ApiClient {
    protected rules: RegExp = /(?<=^(\^|矧))./ // 验证触发查询文字编码规则
    constructor(readonly qqMsg) {
        super(qqMsg)
        this.judgeRules()
    }
    judgeRules() {
        /* 判断规则是否通过 */
        const { message } = this.qqMsg
        if (this.rules.test(message)) {
            this.handle() // 规则通过，进来了
        }
    }
    async handle() {
        /* 规则通过了，就进行处理 */
        const { message } = this.qqMsg
        const type: string = '矧'
        const [word]: string = message.match(this.rules)
        const result: any = await this.climbTextCod(type, word)
        if (result.code === -5) {
            this.sendTextMsg(result.msg)
        } else {
            const { word, structure, cod } = result
            const str: string = `▁▂▃▄▅${word}▅▄▃▂▁
结构↬ ${structure}
编码↬ ${cod}`
            this.sendTextMsg(str)
        }
    }

    /**
     * 
     * @param type 要查询的编码类型
     * @param word  要查询的字
     */
    async climbTextCod(type: string, word: string): Promise<object> {
        /* 拿东西，进行诶诶啊啊 */
        const url = encodeURI(`http://xlboy.cn:8988/getTextCod`)
        console.log('url', url)
        try {
            const { data } = await axios.get(url, { params: { type, word } })
            return data
        } catch (error) {
            console.error('error', error)
            return { code: -5, msg: 'TextCodQuery模块异常，请联系开发人员' }
        }
    }
}