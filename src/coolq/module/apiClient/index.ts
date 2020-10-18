import axios, { AxiosInstance } from 'axios'
import { qqMsg } from 'src/coolq/interface/qqMsg'

const isLocal: boolean = true

export class ApiClient {
    private apiClient: AxiosInstance
    private baseUrl: string = isLocal ? 'http://xlboy.cn:5700' : 'http://127.0.0.1:5700/'
    constructor(protected readonly qqMsg: qqMsg) {
        this.createApiClient()
    }
    createApiClient() {
        const headers = { 'Content-Type': 'application/json' }
        this.apiClient = axios.create({ baseURL: this.baseUrl, headers })
    }

    async sendTextMsg(message: String) {
        /* 发送文本消息 */
        this.apiClient.post(`/send_msg/`, { ...this.qqMsg, message })
    }
}