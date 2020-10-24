import { ApiClient } from "../../../apiClient";
import axios from 'axios'
import { IQQMsg } from "src/coolq/interface/IQQMsg";
const userState: object = {} // 用户的开启状态

export class Translation extends ApiClient {
    protected rules: RegExp = /^(日中|中日|英中|中英|韩中|中韩)/ // 验证触发翻译开启的规则，开启后会实时进行翻译，用户每说的一句话都会进行实时翻译
    constructor(protected readonly qqMsg: IQQMsg) {
        super(qqMsg)
        this.judgeRules()
    }
    public async judgeRules() {
        /* 判断规则是否通过 */
        const { message, user_id } = this.qqMsg
        if (this.rules.test(message)) {
            this.switchHandle() // 开关规则通过，处理开关状态存储
        } else if (userState[user_id]?.status) {
            const { f, t } = userState[user_id]
            const result: string = await this.climbTranslation(f, t, message) // 拿到翻译内容
            this.sendTextMsg(result)
        }
    }
    public async switchHandle() {
        /* 进行开关状态存储  */
        const { message, user_id } = this.qqMsg
        const country: object = {
            日: 'ja',
            中: 'zh',
            英: 'en',
            韩: 'ko'
        }
        const f: string = country[message[0]]
        const t: string = country[message[1]]

        switch (message[2]) {
            case '开':
                userState[user_id] = {
                    status: true,
                    f,
                    t
                }
                this.sendTextMsg('start!rushB!rushB!')
                break;
            case '关':
                userState[user_id].status = false
                this.sendTextMsg('close!quit!quit!')
                break;
        }
    }

    /**
     * 
     * @param f 初始语言
     * @param t 目标语言
     * @param w 翻译的内容
     */
    public async climbTranslation(f: string, t: string, w: string): Promise<string> {
        /* 拿东西，进行诶诶啊啊 */
        const url = "http://fy.iciba.com/ajax.php?a=fy";
        const param = new URLSearchParams()
        param.append('f', f)
        param.append('t', t)
        param.append('w', w)
        try {
            const { data: { content: { out } } } = await axios.post(url, param);
            return out || '小孩子不可以讲脏话哦'
        } catch (error) {
            console.error('error', error)
            return '很遗憾呢，这翻车车了呢'
        }

    }
}