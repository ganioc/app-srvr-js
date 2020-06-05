const _ = require('lodash');
const mongoose = require('mongoose');
const util = require('util')

const Worker = require('bullmq').Worker;
const bullmq = require('../lib/bullmq')
// const logger = require('../lib/logger')
// const util = require('util')
const setMsg = require('../lib/db/setMsg')


const cfgObj = require('../config/config.json');

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
  return new Promise((resolve, reject) => {
    // check db data
    // create the database
    console.log('handleDefaultJob()')

    // 
  })
}

function handleSingleMsgJob(data) {
  return new Promise(async (resolve, reject) => {
    console.log('handleSingleMsgJob()')
    // save msg to db
    let result = await setMsg(
      data.username,
      1,
      data.mobiles,
      data.content,
      data.data
    )

    // if succeed
    if (result.code === 0) {
      resolve({ code: 0 })
    } else {
      reject({
        code: result.code,
        message: 'setMsg failed'
      })
    }

    // save to Msgton

    // check status ,

    // update Msgton


  })
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

