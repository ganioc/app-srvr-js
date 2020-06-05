const Worker = require('bullmq').Worker;
const bullmq = require('../lib/bullmq')
const logger = require('../lib/logger')
const util = require('util')

function handleDefaultJob(data) {
  return new Promise((resolve, reject) => {
    // check db data
    // create the database
    logger.debug('handleDefaultJob()')

    // 
  })
}

const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
  if (job.name === bullmq.DEFAULT_JOB_NAME) {
    logger.info("Receive job:" + bullmq.DEFAULT_JOB_NAME);
    logger.info(`${job.id}`)
    logger.debug(util.format('%o', job.data))
    await handleDefaultJob(job.data);
  } else {
    logger.error('Unrecognized job.name : ' + job.name)
  }
})

worker.on('completed', (job) => {
  logger.info(`job ${job.id} completed`)
})
worker.on('failed', (job, err) => {
  logger.error(`job ${job.id} failed with ${err.message}`)
})
console.log('msgworker start');

