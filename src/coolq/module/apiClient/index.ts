import axios, { AxiosInstance } from 'axios'

export interface ApiClientInterface {
    send: Function // 发送消息的函数
}

export class ApiClient {
    private apiClient: AxiosInstance
    private baseUrl: string = 'http://127.0.0.1:5700/'
    constructor(readonly qqMsg) {
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