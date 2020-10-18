import codJson from "./codJson";

export class CodQuery {
    /**
     * 
     * @param type 码表key
     * @param text 要查询的文字
     */
    constructor(protected readonly type: string,
        protected readonly text: string) {

    }

    query(): object {
        if (typeof codJson[this.type] === 'undefined') {
            return {
                code: -5,
                msg: "系统中并没有此码表，请注意",
            };
        }
        console.log(`Buffer.from('𣭱').toString('base64')`, Buffer.from('𣭱').toString('base64'))
        console.log(`btoa(encodeURI('𣭱'))`, Buffer.from(this.text).toString('base64'))
        const queryCodRules: RegExp = RegExp(`(?<=\n)${this.text}.+?(?=\n)`);
        // console.log('queryCodRules', queryCodRules)
        // 如果match拿到的是null，则取[]。    
        // [result]取数组中第一个元素，然后判断第一个元素是否为true,如果为true则证明取出了里面的匹配段
        // 如果没取出，为false，就匹配不到咯
        const [result]: any = [...(codJson[this.type].match(queryCodRules) || [])];
        if (result) {
            const [word, structure, cod]: string = result.split("	"); // word为字，structure为结构, cod为编码
            return {
                word,
                structure,
                cod,
            };
        } else {
            return {
                code: -5,
                msg: "很遗憾，并没有搜到您所期待的",
            }
        }
    };
}