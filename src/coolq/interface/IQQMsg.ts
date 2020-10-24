export interface IQQMsg {
    ClassType: string, // 消息类-类型
    self_id: string, // 接收者ID(QQ)
    sub_type: string, // 提交类型？正常的？
    message_id: string, // 消息ID
    group_id?: string,  // 群ID(群号)
    user_id: string, // 发送者ID(QQ)
    anonymous?: '', // 不知是是
    message: string, // 接收到内容消息
    raw_message?: string, // 接收到消息内容
    font?: string, // 未知
    sender?: // 发送者的详细信息
    {
        user_id?: string,
        nickname?: string,
        card?: string,
        sex?: string,
        age?: string,
        area?: string,
        level?: string,
        role?: string,
        title?: string
    },
    time: string, // 发送时间-时间戳
    post_type: string, // 发送类型，有messge、event、notice
    message_type: string, // 消息类型
}