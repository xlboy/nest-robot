import { ApiClient } from "../../../apiClient";
import { qqMsg } from "src/coolq/interface/qqMsg";
import { CodQuery } from "./codQuery";



export class TextCodQuery extends ApiClient {
    protected rules: RegExp = /(?<=^(\^|矧))[^码]/ // 验证触发查询文字编码规则，开头以^或矧，并且第二个字不为  码。

    constructor(protected readonly qqMsg: qqMsg) {
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
        const type: string = '矧' // 默认是矧，当前系统就只提供一个码表的查询，后续如有延伸，小改即可
        const [word]: any = message.match(this.rules)
        const codQuery = new CodQuery(type, word)
        const result: any = codQuery.query()

        if (result.code === -5) {
            this.sendTextMsg(result.msg)
        } else {
            const { word, structure, cod } = result
            const str: string = `${type}:${word}
结构↬ ${structure}
编码↬ ${cod}`
            this.sendTextMsg(str)
        }
    }
}