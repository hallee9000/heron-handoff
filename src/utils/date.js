export function padWithZeros (vNumber, width) {
  let numAsString = vNumber.toString();
  while (numAsString.length < width) {
      numAsString = '0' + numAsString;
  }
  return numAsString;
}

export function dateFormat (date) {
  const dateObj = new Date(date);
  const thisYear = new Date().getFullYear();
  const vDay = padWithZeros(dateObj.getDate(), 2);
  const vMonth = padWithZeros(dateObj.getMonth() + 1, 2);
  const vYear = padWithZeros(dateObj.getFullYear(), 2);
  // const vHour = padWithZeros(date.getHours(), 2);
  // const vMinute = padWithZeros(date.getMinutes(), 2);
  // const vSecond = padWithZeros(date.getSeconds(), 2);
  if ((vYear) < thisYear) {
    return `${vYear}年${vMonth}月${vDay}日`;
  } else {
    return `${vMonth}月${vDay}日`;
  }
}

export function relativeTime (date) {
  try {
    const oldTime = (new Date(date)).getTime();
    const currTime = new Date().getTime();
    const diffValue = currTime - oldTime;

    const days = Math.floor(diffValue / (24 * 3600 * 1000));
    if (days === 0) {
      //计算相差小时数
      const leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000));
      if (hours === 0) {
        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000));
        if (minutes === 0) {
          //计算相差秒数
          const leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
          const seconds = Math.round(leave3 / 1000);
          return seconds + ' 秒前';
        }
        return minutes + ' 分钟前';
      }
      return hours + ' 小时前';
    }
    if (days < 0) return '刚刚';

    if (days < 8) {
      return days + ' 天前';
    } else {
      return dateFormat(date)
    }
  } catch (error) {
    console.error(error)
  }
}
