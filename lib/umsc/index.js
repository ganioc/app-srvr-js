const request = require('request');
const querystring = require('querystring');
const cfgObj = require('../../config/config.json');
const SIGN = require('./sign.js');
const getSign = SIGN.getSign;

const ErrCode = require('../err')

const APPKEY = cfgObj.platform.APPKEY
const APPID = cfgObj.platform.APPID
const SINGLE_URL = cfgObj.platform.SINGLE_URL
const TAG = cfgObj.platform.TAG

// get a different id , everytime;
let getIdSignleton = (function () {
  let id = Math.floor(0x10000 * Math.random());

  return () => {
    id++;
    if (id > 0x1000000) {
      id = 1;
    }
    console.log('getIdSingleton', id);
    return id;
  }
})();

let getTimestamp = () => {
  let stime = new Date().getTime().toString();
  stime = stime.slice(0, stime.length - 3);
  return stime;
}
function getPostData(data) {
  let m = {
    appid: APPID,
    sign: '',
    timestamp: '',
    data: '',
    appkey: APPKEY,
    // format: 'json',
    // version: '2.0',
  };
  // let m = _.clone(mObj);
  m.timestamp = getTimestamp();
  m.data = data;
  m.sign = getSign(m);

  console.log('\ngetPostData:')
  console.log(m)

  delete m.appkey;

  return m;
}
let funcSingle = (mobile, content) => {
  return new Promise((resolve, reject) => {
    console.log('Send single')
    console.log('mobile:', mobile)
    console.log('content:', content)

    let data = JSON.stringify({
      mobile: mobile,
      content: content + '【' + TAG + '】',
      xid: getIdSignleton().toString()
    });

    let form = getPostData(data);

    let formData = querystring.stringify(form);
    console.log('\nformData:');
    console.log(formData);

    let contentLength = formData.length;
    console.log('\nformData len:', contentLength)

    console.log('\nSend msg out');
    request({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: SINGLE_URL,
      body: formData,
      method: 'POST'
    }, (err, res, body) => {
      if (err) {
        console.log(err);
        resolve({
          code: ErrCode.MSG_SEND_FAIL
        })
      } else {
        console.log('\nres:');
        // console.log(res);
        console.log('\nbody:');
        console.log(body);
        if (body.code === 0) {
          resolve({
            code: 0
          })
        }
        else {
          resolve({
            code: body.code
          })
        }
      }
    });
  })
}

module.exports = {
  single: funcSingle
}