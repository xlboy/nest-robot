import { ApiClient } from "../../../apiClient";
import { IQQMsg } from "src/coolq/interface/IQQMsg";
import { CodQuery } from "./localCodQuery";
import axios from 'axios'
import md5Crypto from "src/common/utils/md5";
import randomSymbols from "src/common/utils/randomSymbols"; // 随机生成一个特殊符号

// 验证规则组相对应的正则与处理方法
interface IRulesGroupObject {
    reg: RegExp, // 要验证的正则
    method: string, // 验证通过后要处理的方法名，在这个类里面
}

export class TextCodQuery extends ApiClient {
    protected rulesGroup: IRulesGroupObject[] = [
        {
            reg: /(?<=^(\^|矧))[^码]/,
            method: 'localQuery'
        },
        {
            reg: /(?<=^(\?|？|鹤)).$/,
            method: 'fetchXHQuery'
        }] // 验证规则组，第一个组是本地形式的，第二个组是网络形式（接老范的鹤形）的

    constructor(protected readonly qqMsg: IQQMsg) {
        super(qqMsg)
        this.judgeRules()
    }


    public judgeRules() {
        /* 判断规则是否通过 */
        const { message } = this.qqMsg
        this.rulesGroup.forEach(({ reg, method }) => reg.test(message) && this[method](reg))
    }


    /**
     * 
     * @param rules 相对应的正则，用来取出要查询的字符
     */
    public async localQuery(rules: RegExp) {
        /* 本地查询，不需要外接其他接口 */
        const { message } = this.qqMsg
        const type: string = '矧' // 默认是矧，当前系统就只提供一个码表的查询，后续如有延伸，小改即可
        const [word]: any = message.match(rules)
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


    /**
     * 
     * @param rules 相对应的正则，用来取出要查询的字符
     */
    public async fetchXHQuery(rules: RegExp) {
        /* 小鹤的编码查询对接 */
        const { message } = this.qqMsg
        const [word]: any = message.match(rules)
        const url: string = "http://www.xhup.club//Xhup/Search/searchCode";
        const param: URLSearchParams = new URLSearchParams()
        param.append('search_word', word)
        param.append('sign', md5Crypto(`fjc_xhup${word}`))
        try {
            const { data:
                {
                    list_dz: results
                }
            } = await axios.post(url, param);
            if (results.length === 0) {
                this.sendTextMsg('系统未收录此字')
            } else {
                // allCode是全部编码，breakUp是拆分结构，sStroke是开始笔画，e则是结束笔画。sCod是开始的字形编码，eCod则是结束编码
                const [allCode, breakUp, sStroke, eStroke, sCod, eCod] = results[0]
                const resultStr: string = `${randomSymbols()} ${word}
全码↬ ${String(allCode.match(/[a-z].*[a-z]/))}
拆分↬ ${breakUp}
首末↬ ${sStroke + eStroke}
编码↬ ${sCod + eCod}`
                this.sendTextMsg(resultStr)
            }
        } catch (error) {
            console.error('error', error)
            this.sendTextMsg('很遗憾，查询翻车车了哦')
        }
    }
}