import axios, { AxiosInstance } from 'axios'
import { IQQMsg } from 'src/coolq/interface/IQQMsg'

const isLocal: boolean = false

export class ApiClient {
    private apiClient: AxiosInstance
    private readonly baseUrl: string = isLocal ? 'http://xlboy.cn:5700' : 'http://127.0.0.1:5700/'
    constructor(protected readonly qqMsg: IQQMsg) {
        this.createApiClient()
    }
    public createApiClient() {
        const headers = { 'Content-Type': 'application/json' }
        this.apiClient = axios.create({ baseURL: this.baseUrl, headers })
    }

    public async sendTextMsg(message: string) {
        /* 发送文本消息 */
        this.apiClient.post(`/send_msg/`, { ...this.qqMsg, message })
    }
}