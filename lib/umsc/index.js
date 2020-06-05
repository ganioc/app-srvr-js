const request = require('request');
const querystring = require('querystring');
const logger = require('../logger')
const util = require('util')

const cfgObj = require('../../config/config.json');
const SIGN = require('./components/sign.js');
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
    logger.debug('getIdSingleton', id);
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

  logger.debug('\ngetPostData:')
  logger.debug(util.format('%o', m))

  delete m.appkey;

  return m;
}
/**
 * Send a message out to a single mobile phone
 * @param {*} mobile 
 * @param {*} content 
 */
let funcSingle = (mobile, content) => {
  return new Promise((resolve, reject) => {
    logger.info('Send single, mobile:' + mobile)
    logger.info(util.format('text; %o', content))

    let data = JSON.stringify({
      mobile: mobile,
      content: content + '【' + TAG + '】',
      xid: getIdSignleton().toString()
    });

    let form = getPostData(data);

    let formData = querystring.stringify(form);
    logger.debug('formData:');
    logger.debug(util.format('%o', formData))

    let contentLength = formData.length;
    logger.debug('formData len: ' + contentLength)

    logger.debug('Send msg out');
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
        logger.error(util.format('%o', err));
        resolve({
          code: ErrCode.MSG_SEND_FAIL
        })
      } else {
        // console.log('\nres:');
        // console.log(res);
        logger.debug('nbody:');
        logger.debug(util.format('%o', body));
        // analyaze body to check if it's really sent
        let nBody = null
        try {
          nBody = JSON.parse(body.toString())
        } catch (e) {
          nBody.result = ErrCode.MSG_SEND_WRONG_JSON
        }

        if (nBody.result === 0) {
          resolve({
            code: 0,
            data: nBody
          })
        }
        else {
          resolve({
            code: nBody.result
          })
        }
      }
    });
  })
}

module.exports = {
  single: funcSingle
}