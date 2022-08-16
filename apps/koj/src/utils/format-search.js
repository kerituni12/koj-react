import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export function formatSearch(se) {
  se = decodeURIComponent(se);
  se = se.substr(1); //从起始索引号提取字符串中指定数目的字符
  const arr = se.split('&'); //把字符串分割为字符串数组
  const obj = {};
  let newarr = [];

  arr.forEach((v, i) => {
    newarr = v.split('=');
    if (typeof obj[newarr[0]] === 'undefined') {
      obj[newarr[0]] = newarr[1];
    }
  });

  return obj;
}

export function html(html, opts = {}) {
  return parse(DOMPurify.sanitize(html));
}
