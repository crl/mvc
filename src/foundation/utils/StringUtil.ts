
/// <summary>
/// 字符串处理类
/// </summary>
class StringUtil {
    static trim(value: string) {
        if (!value) {
            return "";
        }
        else {
            return StringUtil.ltrim(StringUtil.rtrim(value));
        }
    }


    static ltrim(str: string): string {
        if (!str)
            return "";
        var char = str.charAt(0);
        while (str.length > 0 && char == " ") {
            str = str.substr(1);
            char = str.charAt(0);
        }
        return str;
    }

    static rtrim(str: string): string {
        if (!str)
            return "";
        var char = str.charAt(str.length - 1);
        while (str.length > 0 && char == " ") {
            str = str.substr(0, str.length - 1);
            char = str.charAt(str.length - 1);
        }
        return str;
    }

    static isWhitespace(character: string): boolean {
        switch (character) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
        }

        return false;
    }

    public static substitute(value: string, ...parms): string {
        if (!value) {
            return "";
        }
        let v;
        let len = parms.length;
        for (let i = 0; i < len; i++) {
            let vo = parms[i];
            if (vo == null) {
                continue;
            }
            v = vo.toString();
            value = value.replace("{" + i + "}", v);
        }
        return value;
    }

    /// <summary>
    /// 去除数字
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    static trimDig(s: string): string {
        let l = s.length;
        let sb = new Array<string>();
        let i = 0;
        while (i < l) {
            let c = s[i];
            if (c >= '0' && c <= '9') {
                //是数字
            }
            else {
                sb.push(c);
            }
            i++;
        }

        return sb.join("");
    }

    /// <summary>
    /// 计算一个字符串所占用的字节数，英文占用1个，中文占用2个
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    public static GerStringLen(str: string): number {
        let num = 0;
        let len = str.length;
        for (let i = 0; i < length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) {
                num++;
            }
            else {
                num += 2;
            }
        }
        return num;
    }
}
