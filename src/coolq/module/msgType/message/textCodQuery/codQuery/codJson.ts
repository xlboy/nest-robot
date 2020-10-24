/* 初始化码表数据 */

import * as fs from 'fs'
import * as path from 'path'
import * as iconvLite from 'iconv-lite'
import shenCod from './shenCod'
const initCodJson = (): object => {
    /* 初始化一下码表的JSON数据 */
    /* 读取指定目录下的所有码表文件 */
    /* 读取后，将文件名除去后缀，作为JSON中的KEY名，值则为文件里的内容 */
    const codJson: object = {}
    const codPath: string = path.resolve() + '/public/service/coolq/cod/'
    const codNames: any = fs.readdirSync(codPath)
    codNames.forEach((e: string) => {
        const codKey: string = e.replace(/\..+/, '')
        const codVal: Buffer = fs.readFileSync(codPath + e)
        codJson[codKey] = iconvLite.decode(codVal, 'utf-8')
    });
    return codJson
}
const codJson: object = initCodJson()
codJson['矧'] = shenCod // 矧码单独处理，里面有超出五行之外的字（𨬪𪧣𪧠𪛔...），读不出（各种转码都不好使，没必要浪费心思）
export default codJson
