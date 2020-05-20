const _ = require('lodash');
const SIGN = require('./sign.js');
const getSign = SIGN.getSign;

if (!process.env.APPID) {
  console.log('APP_ID not set')
  process.exit(1);
}
if (!process.env.APPKEY) {
  console.log('APP_KEY not set')
  process.exit(1);
}
const APPID = process.env.APPID;
const APPKEY = process.env.APPKEY;


let mObj = {
  appid: APPID,
  sign: '',
  timestamp: '',
  data: '',
  appkey: APPKEY,
  // format: 'json',
  // version: '2.0',
};
/**
 * 
 * @param {*} obj 
 * return String
 */
function formatPostData(obj) {
  let str = '';
  let keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === 'appkey') {
      continue;
    }
    str += '&' + keys[i] + '=' + obj[keys[i]]
  }

  str = str.slice(1, str.length);

  return str;
}
/**
 * 
 * @param {*} data object contains 
 * return String
 */
function getPostData(data) {
  let m = _.clone(mObj);
  let stime = new Date().getTime().toString();
  stime = stime.slice(0, stime.length - 3);
  m.timestamp = stime;
  m.data = JSON.stringify(data);
  m.sign = getSign(m);

  console.log('\ngetPostData:')
  console.log(m)

  return formatPostData(m);
}
function testSingleSend() {
  console.log('\nGenerate singleSend packet:')
  let data = {
    "mobile": "13041686656",
    "content": "验证码35500，您正在发起面对面注册，感谢您的支持！【本来生活】",
    "xid": "123468"
  }
  console.log('\n', getPostData(data));
}
function main() {
  console.log('Send:');

  testSingleSend();
}

main();