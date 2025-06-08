

Date.prototype.Format = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt
}

export function formatTimeToStr(times, pattern) {
    var d = new Date(times).Format('yyyy-MM-dd hh:mm:ss')
    if (pattern) {
        d = new Date(times).Format(pattern)
    }
    return d.toLocaleString()
}

function addZero(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

export function formatTimestamp(timestamp) {
    var date = new Date(timestamp * 1000);
    // 提取日期和时间组件
    var year = date.getFullYear(); // 年份
    var month = date.getMonth() + 1; // 月份（注意要加 1，因为月份是从 0 到 11）
    var day = date.getDate(); // 日期
    var hours = date.getHours(); // 小时
    var minutes = date.getMinutes(); // 分钟
    var seconds = date.getSeconds(); // 秒
    // 构建可读的时间字符串
    var formattedDate = year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);
    // 辅助函数，用于确保日期和时间部分是两位数
    return formattedDate
}

export function formatDate(str) {
    console.log(str)
    var date = new Date(str)
    // 提取日期和时间组件
    var year = date.getFullYear(); // 年份
    var month = date.getMonth() + 1; // 月份（注意要加 1，因为月份是从 0 到 11）
    var day = date.getDate(); // 日期
    var hours = date.getHours(); // 小时
    var minutes = date.getMinutes(); // 分钟
    var seconds = date.getSeconds(); // 秒
    // 构建可读的时间字符串
    var formattedDate = year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);
    // 辅助函数，用于确保日期和时间部分是两位数
    return formattedDate
}
