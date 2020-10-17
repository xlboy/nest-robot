import { ApiClient } from "../../../apiClient";
const city = require('./city.json')
import axios from 'axios'
import filterList from "./data/filterList";

const removeLow = (str: string): string => str.replace(/低温 /g, '')
const removeHigh = (str: string): string => str.replace(/高温 /g, '')
export class Weather extends ApiClient {
    protected rules: RegExp = /(^|)天气|温度|\d+度|雨|雪|风|冷|热|雷|气温/ // 验证触发天气规则
    protected filterList: Array<number> = filterList
    constructor(readonly qqMsg) {
        super(qqMsg)
        this.judgeRules()
    }
    judgeRules() {
        /* 判断规则是否通过 */
        const { message, group_id } = this.qqMsg
        console.log('this.filterList', this.filterList)
        console.log('group_id------', group_id)
        console.log('this.filterList.includes', this.filterList.includes(parseInt(group_id)))
        if (this.rules.test(message) &&  !this.filterList.includes(parseInt(group_id))) {
            this.handle() // 规则通过，进来了
        }
    }
    async handle() {
        /* 规则通过了，就进行处理 */
        let { message } = this.qqMsg

        // 通过城市文本拿到对应的cityId
        message = message.replace(/天气| |的/g, '') // 将字符里的 天气 / 空格 替换掉
        if (city[message]) {
            // 如果能直接通过 键名 取出城市对应的cityId就直接走
            const result: string = await this.climbWeather(city[message])
            this.sendTextMsg(result)
        } else {
            // 不能通过 键名 取出城市对应的cityId，就遍历一遍所有键名，判断是否包含msg关键字
            const fetchWeather = async (val: string) => {
                const result: string = await this.climbWeather(val)
                this.sendTextMsg(result)
            }
            const isExist: boolean = Object.entries(city).some(([key, val]) => {
                if ((key.indexOf(message) !== -1 || message.indexOf(key) !== -1) && val) {
                    // 利用indexOf判断是否包含关键字，若有那就取 val(可能会是空字符串) 触发请求 
                    fetchWeather(String(val))
                    return true
                }
                return false
            });
            if (!isExist) {
                // this.sendTextMsg('没有这个城市呢亲，建议回炉重造呢')
            }
        }
    }

    /**
     * 
     * @param cityId 城市的id
     */
    async climbWeather(cityId: string): Promise<string> {
        /* 拿东西，进行诶诶啊啊 */
        const url: string = `http://t.weather.itboy.net/api/weather/city/${cityId}`;
        try {
            const { data: { status, cityInfo, data, time } } = await axios.get(url);
            if (status === 200) {
                const str = `查询成功，${cityInfo.city}天气如下：\r
更新时间：${time}\r
当前气温：${data.wendu}℃\r
当前天气：${data.forecast[0].type}\r
最高气温：${removeHigh(data.forecast[0].high)}\r
最低气温：${removeLow(data.forecast[0].low)}\r
当前风力：${data.forecast[0].fx} ${data.forecast[0].fl}\r
温馨提示：${data.forecast[0].notice}\r
未来几天：\r
                ${data.forecast[1].date}号：${removeLow(data.forecast[1].low)} ~  ${removeHigh(data.forecast[1].high)}\r
                ${data.forecast[2].date}号：${removeLow(data.forecast[2].low)} ~  ${removeHigh(data.forecast[2].high)}\r
                ${data.forecast[3].date}号：${removeLow(data.forecast[3].low)} ~  ${removeHigh(data.forecast[3].high)}\r
                ${data.forecast[4].date}号：${removeLow(data.forecast[4].low)} ~  ${removeHigh(data.forecast[4].high)}`
                return str
            } else {
                return '求求你输入个正确的地名吧'
            }

        } catch (error) {
            console.error('error', error)
            return '很遗憾呢，这边翻车车了呢'
        }

    }
}