const bullmq = require('../lib/bullmq')
const Worker = require('bullmq').Worker;

const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
  if (job.name === bullmq.DEFAULT_JOB_NAME) {
    console.log("paint the car to");
    console.log(job.data)
  }
})


// function handleDefaultJob(data) {
//   return new Promise((resolve, reject) => {
//     // check db data
//     // create the database
//     logger.debug('handleDefaultJob()')
//     setTimeout(() => {
//       resolve('ok')
//     });
//     // 
//   })
// }

// const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
//   if (job.name === bullmq.DEFAULT_JOB_NAME) {
//     logger.info("Receive job:" + bullmq.DEFAULT_JOB_NAME);
//     logger.info(`${job.id}`)
//     logger.debug(util.format('%o', job.data))
//     await handleDefaultJob(job.data);
//   } else {
//     logger.error('Unrecognized job.name : ' + job.name)
//   }
// })
