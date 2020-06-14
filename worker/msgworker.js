// const _ = require('lodash');
const mongoose = require('mongoose');
const util = require('util')
const Worker = require('bullmq').Worker;
const bullmq = require('../lib/bullmq')
// const logger = require('../lib/logger')
// const util = require('util')
// const ErrCode = require('../lib/err')
const setMsg = require('../lib/db/setMsg')
const setMsgton = require('../lib/db/setMsgton')
const cfgObj = require('../config/config.json');
const checkSingleMsgStatus = require('../lib/umsc/').checkSingleMsgStatus;
const updateMsgton = require('../lib/db/updateMsgton')

let dbIp = 'localhost';
let dbPort = '27017';
let dbName = 'test';

console.log('config file:')
console.log(util.format('%o', cfgObj))


if (!cfgObj) {
  console.error('No config file found')
  process.exit(1)
}

let header = cfgObj.mongo_user + ':'
  + encodeURIComponent(cfgObj.mongo_passwd) + '@';
let uri = 'mongodb://'
  + header
  + dbIp
  + ':'
  + dbPort
  + '/' + dbName;

console.log('mongodb uri:');
console.log(uri);

mongoose.set('useCreateIndex', true) //加上这个
mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(error => {
    console.error('Connection error')
    console.error(util.format('%o', error));
    process.exit(1);
  });

function handleDefaultJob(data) {
  return new Promise((resolve) => {
    // check db data
    // create the database
    console.log('handleDefaultJob()')
    console.log(data)
    // 
    resolve(0)
  })
}

/**
 * 
 * @param {
 * 
 * } data 
 * 
 * code:
 * message: 
 * 
 */
function handleSingleMsgJob(data) {
  return new Promise((resolve, reject) => {
    console.log('handleSingleMsgJob()');

    (async () => {
      // save msg to db, if msg exist pass
      let result = await setMsg(
        data.username,
        1,
        data.mobiles,
        data.content,
        data.data,
        data.x_id
      )

      // if succeed
      if (result.code !== 0) {
        reject(new Error('setMsg failed'))
        return
      }

      console.log('setMsg OK')

      // save to Msgton
      result = await setMsgton(
        data.username,
        data.mobiles,
        data.data.smsid，
        ''
      )
      if (result.code !== 0) {
        reject(new Error('setMsgton failed'))
        return
      }
      console.log('setMsgton OK')
      // check status ,
      result = await checkSingleMsgStatus(data.data.data.smsid)

      if (result.code !== 0) {
        console.error('checkMsgStatus failed')
        reject(new Error('checkMsgStatus failed'))
        return
      }
      console.log('checkSingleMsgStatus OK')
      //
      let msgObj = result.data;
      // try {
      //   msgObj = JSON.parse(result.data.toString())
      // } catch (e) {
      //   console.error('parse checkSingleMsgStatus result.data fail')
      //   reject(new Error('JSON parse fail'))
      //   return
      // }

      // msg 
      console.log('msgObj:')
      console.log(msgObj)

      if (msgObj.result !== 0 && msgObj.result !== "0") {
        console.error('msgObj result is NOK')
        reject(new Error('get feedback fail'))
        return
      }

      if (!msgObj.data.status) {
        console.error('check status got null result')
        reject(new Error('get status empty'))
        return
      }
      // update Msgton
      result = await updateMsgton(
        msgObj.data.smsid,
        msgObj.data.mobile,
        msgObj.data.status)

      if (result.code !== 0) {
        console.error('updateMsgton failed')
        reject(new Error('updateMsgton failed'))
        return
      }
      console.log('updateMsgton OK')
      resolve()
    })();
  })
}
function handleMultiMsgJob(data) {
  return new Promise((resolve, reject) => {
    console.log('handleMultiMsgJob()');

    (async () => {
      let result = await setMsg(
        data.username,
        2,
        data.mobiles,
        data.content,
        data.data,
        data.x_id
      )
      if (result.code !== 0) {
        console.error('setMsg failed')
        reject(new Error('setMsg failed'))
        return
      }
      console.log('setMsg multi OK')

      // save to Msgton
      for (let i = 0; i < data.mobiles.length; i++) {
        result = await setMsgton(
          data.username,
          [data.mobiles[i]],
          '',
          data.data.batchid
        )
        if (result.code !== 0) {
          reject(new Error('setMsgton failed'))
          return
        }
      }
      console.log('setMsgton OK')

      // result = await checkMultiMsgStatus(data.data.data.smsid)

      console.log('updateMsgton OK')
      resolve()
    })();
  });
}
const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
  if (job.name === bullmq.DEFAULT_JOB_NAME) {
    console.log("Receive job:" + bullmq.DEFAULT_JOB_NAME);
    console.log(`${job.id}`)
    console.log(job.data)
    await handleDefaultJob(job.data);
  }
  else if (job.name === bullmq.SINGLE_MSG_JOB) {
    console.log("Receive job:" + bullmq.SINGLE_MSG_JOB);
    console.log(`${job.id}`)
    console.log(job.data)
    await handleSingleMsgJob(job.data)
  }
  else if (job.name === bullmq.MULTI_MSG_JOB) {
    console.log("Receive job:" + bullmq.MULTI_MSG_JOB)
    console.log(`${job.id}`)
    console.log(job.data)
    await handleMultiMsgJob(job.data)
  }
  else {
    console.error('Unrecognized job.name : ' + job.name)
  }
})

worker.on('completed', (job) => {
  console.log(`job ${job.id} completed`)
})
worker.on('failed', (job, err) => {
  console.log(`job ${job.id} failed with ${err.message}`)
})
console.log('\nmsgworker start');

