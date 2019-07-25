/* 

  文件压缩上传思路

  1. 利用H5的FileReader对象将上传的图片转成base64格式
  2. 利用canvas的drawImage方法重绘上传的图片
  3. 在利用canvas的toDataURL方法将图片压缩
  4. 在将压缩后的base64编码图片转成file对象

*/

// 把base64转成 blob 格式
export function dataURItoBlob(base64Data) {
  var byteString;
  if (base64Data.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(base64Data.split(",")[1]);
  else byteString = unescape(base64Data.split(",")[1]);
  var mimeString = base64Data
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {
    type: mimeString
  });
}

// 把base64转成文件格式
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
// 生成唯一ID
export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
