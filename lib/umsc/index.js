const request = require('request');
const querystring = require('querystring');
const logger = require('../logger')
const util = require('util')

const cfgObj = require('../../config/config.json');
const SIGN = require('./components/sign.js');
const getSign = SIGN.getSign;
const send = require('./components/send').send

const ErrCode = require('../err')

const APPKEY = cfgObj.platform.APPKEY
const APPID = cfgObj.platform.APPID
const SINGLE_URL = cfgObj.platform.SINGLE_URL
const MULTIPLE_URL = cfgObj.platform.MULTIPLE_URL
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
 * 
 * @param {*} mobiles  string array 
 * @param {*} content 
 */
let funcMulti = (mobiles, content) => {
  return new Promise((resolve) => {
    logger.info('funcMulti() Send multi, mobiles')
    logger.debug(util.format('%o', mobiles))
    logger.debug(util.format('%o', content))

    let x_id = SIGN.getId().toString()

    let data = JSON.stringify({
      mobile: mobiles.join(','),
      content: content + '【' + TAG + '】',
      xid: x_id
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
      uri: MULTIPLE_URL,
      body: formData,
      method: 'POST'
    }, (err, res, body) => {
      if (err) {
        logger.error(util.format('%o', err));
        resolve({
          code: ErrCode.MSG_SEND_FAIL,
          data: null
        })
      } else {
        logger.debug('nbody:');
        logger.debug(util.format('%o', body));
        // analyaze body to check if it's really sent
        let nBody = null
        try {
          nBody = JSON.parse(body.toString())
          nBody.x_id = x_id
        } catch (e) {
          nBody.result = ErrCode.MSG_SEND_WRONG_JSON
        }
        /**
         * 返回的多个号码的消息是什么呢？
         * x_id 
         * result: "0"
         * code"""
         * message:"操作成功"
         * data:{
         *    "batchid":"" 
         * }
         */
        if (nBody.result === 0) {
          resolve({
            code: 0,
            data: nBody
          })
        }
        else {
          resolve({
            code: nBody.result,
            data: null
          })
        }
      }
    })
  });
}
/**
 * Send a message out to a single mobile phone
 * @param {*} mobile 
 * @param {*} content 
 */
let funcSingle = (mobile, content) => {
  return new Promise((resolve) => {
    logger.info('Send single, mobile:' + mobile)
    logger.info(util.format('text; %o', content))
    let x_id = getIdSignleton().toString()

    let data = JSON.stringify({
      mobile: mobile,
      content: content + '【' + TAG + '】',
      xid: x_id
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
          code: ErrCode.MSG_SEND_FAIL,
          data: null
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
          nBody.x_id = x_id.toString()
        } catch (e) {
          nBody.result = ErrCode.MSG_SEND_WRONG_JSON
        }
        /**
         * 返回的是什么呢？
         * x_id: "",
         * result:"0"
         * code:"0"
         * "message":""
         * "data":{
         *    "smsid": ""
         * }
         */
        if (nBody.result === 0) {
          resolve({
            code: 0,
            data: nBody
          })
        }
        else {
          resolve({
            code: nBody.result,
            data: null
          })
        }
      }
    });
  })
}

function funcCheckMultiMsgStatus(mobile, batchid) {
  return new Promise((resolve) => {
    logger.debug('funcCheckMultiMsgStatus()')

    let mMobile = mobile;
    logger.debug(mMobile);

    let globalObj = {
      APPKEY: cfgObj.platform.APPKEY,
      APPID: cfgObj.platform.APPID,
      URL: cfgObj.platform.SINGLE_MSG_STATUS_URL,
    }

    let form = SIGN.genDoubleData(globalObj, 'mobile', mMobile, 'batchid', batchid);
    logger.debug('form:')
    logger.debug(util.format('%o', form))

    send(form, globalObj.URL, (err, resp, body) => {
      if (err) {
        logger.error('send fail');
        resolve({
          code: ErrCode.UMSC_NETWORK_FAIL,
          data: null
        })
      } else {
        try {
          console.log(body)
          let obj = JSON.parse(body.toString())
          logger.debug('get status:')
          logger.debug(util.format('%o', obj))
          /**
           * 返回的额格式是什么呢？
           * result
           * code
           * data:{
           *  xid:
           *  smsid:
           *  statusmsg:
           *  mobile:
           *  batchid:
           *  status:
           * }
           */
          resolve({
            code: 0,
            data: obj
          })
        } catch (e) {
          logger.error('Json.parse failure')
          resolve({
            code: ErrCode.UMSC_JSON_PARSE_FAIL,
            data: {}
          })
        }
      }
    })
  });
}
/**
 * check msg status according to smsid
 */

function funcCheckSingleMsgStatus(id) {
  return new Promise((resolve) => {
    logger.debug('funcCheckSingleMsgStatus()')
    let smsid = id + '';
    logger.debug(smsid)
    let globalObj = {
      APPKEY: cfgObj.platform.APPKEY,
      APPID: cfgObj.platform.APPID,
      URL: cfgObj.platform.SINGLE_MSG_STATUS_URL,
      SMSID: smsid,
    }

    let form = SIGN.genData(globalObj, 'smsid', smsid);
    logger.debug('form:')
    logger.debug(util.format('%o', form))

    send(form, globalObj.URL, (err, resp, body) => {
      if (err) {
        logger.error('send fail');
        resolve({
          code: ErrCode.UMSC_NETWORK_FAIL,
          data: null
        })
      } else {
        try {
          console.log(body)
          let obj = JSON.parse(body.toString())
          logger.debug('get status:')
          logger.debug(util.format('%o', obj))
          /**
           * 返回的额格式是什么呢？
           * 
           */
          resolve({
            code: 0,
            data: obj
          })
        } catch (e) {
          logger.error('Json.parse failure')
          resolve({
            code: ErrCode.UMSC_JSON_PARSE_FAIL,
            data: {}
          })
        }
      }
    })
  })
}

function funcGetBalance() {
  return new Promise((resolve) => {
    logger.debug('funcGetBalance()')
    let globalObj = {
      APPKEY: cfgObj.platform.APPKEY,
      APPID: cfgObj.platform.APPID,
      URL: cfgObj.platform.GET_BALANCE_URL,
    }

    let form = SIGN.genData(globalObj, '', null);
    logger.debug('form:')
    logger.debug(util.format('%o', form));

    send(form, globalObj.URL, (err, resp, body) => {
      if (err) {
        logger.error("send fail!");
        logger.error(util.format('%o', err));
        resolve({
          code: ErrCode.UMSC_NETWORK_FAIL
        })
      } else {
        logger.debug("send succeed")
        logger.debug(util.format('%o', body));

        let nBody = null
        try {
          nBody = JSON.parse(body.toString())
        } catch (e) {
          nBody.result = ErrCode.MSG_SEND_WRONG_JSON
        }

        if (nBody.result === 0 || nBody.result === "0") {
          resolve({
            code: 0,
            data: nBody
          })
        }
        else {
          resolve({
            code: nBody.result,
            data: null
          })
        }
      }
    })
  })
}

module.exports = {
  single: funcSingle,
  multi: funcMulti,
  checkSingleMsgStatus: funcCheckSingleMsgStatus,
  checkMultiMsgStatus: funcCheckMultiMsgStatus,
  statusToNum: (str) => {
    if (str === 'DELIVRD') {
      return 3; // 3 is delivered only
    } else {
      logger.error('Unrecognized status code')
      logger.error(str)
      return -1
    }
  },
  getBalance: funcGetBalance,
}