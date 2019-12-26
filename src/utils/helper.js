export const throttle = (fn, delay) => {
 	var timer = null
 	return function(){
 		var context = this, args = arguments;
 		clearTimeout(timer)
 		timer = setTimeout(function(){
 			fn.apply(context, args);
 		}, delay)
 	}
}

export const getFileKey = pageUrl => {
  if (!/^https:\/\/(www.)?figma.com\/file\//.test(pageUrl)) {
    return ''
  }
  const parser = document.createElement('a');
  parser.href = pageUrl;
  return parser.pathname.replace('/file/', '').replace(/\/.*/,'');
}

export const urlWithParams = (url, data) => {
  const urlObj = new URL(url)
  Object.keys(data).forEach(key => urlObj.searchParams.append(key, data[key]))
  return urlObj
}
