import * as crypto from 'crypto'
interface IMd5CryptoOptions {
    isUpperCase?: boolean, // 是否大写
}
export default function md5Crypto(str: string, obj?: IMd5CryptoOptions): string {
    if (str) {
        const hash: crypto.Hash = crypto.createHash("md5");
        hash.update(str);
        let result: string = hash.digest("hex")
        if (obj?.isUpperCase === true) {
            result = result.toUpperCase()
        }
        return result;
    } else {
        throw new Error(`str数据有误-----${str}`);
    }

}