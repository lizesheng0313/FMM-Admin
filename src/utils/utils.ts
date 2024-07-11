/*
 * @Author: lizesheng
 * @Date: 2023-02-28 14:34:16
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-06 10:06:53
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/utils/utils.ts
 */

export function isImageUrl(url:string) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = function() {
      resolve(true);
    }
    img.onerror = function() {
      resolve(false);
    }
    img.src = url;
  });
}


export function formatDateTime(milliseconds:any,column:any,cellValue:any) {
   if(!cellValue){return}
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}