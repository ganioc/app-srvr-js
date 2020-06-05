const bullmq = require('../lib/bullmq')
const Worker = require('bullmq').Worker;

// const worker = new Worker('Paint', async job => {
//   if (job.name === 'cars') {
//     console.log("paint the car to");
//     console.log(job.data)
//   }
// })


function handleDefaultJob(data) {
  return new Promise((resolve, reject) => {
    // check db data
    // create the database
    console.log('handleDefaultJob()')
    setTimeout(() => {
      resolve('ok')
    });
    // 
  })
}

const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
  if (job.name === bullmq.DEFAULT_JOB_NAME) {
    console.log('receive a job', `${job.id}`)
    // logger.info('Receive in logger')
    console.log("Receive job:" + bullmq.DEFAULT_JOB_NAME);
    console.log(`${job.id}`)
    // consoel.log(util.format('%o', job.data))
    console.log(job.data)
    // console.log(util.format('%o', job.data))
    await handleDefaultJob(job.data);
  } else {
    // logger.error('Unrecognized job.name : ' + job.name)
  }
})

// const worker = new Worker(bullmq.DEFAULT_QUEUE_NAME, async job => {
//   if (job.name === bullmq.DEFAULT_JOB_NAME) {
//     console.log("paint the car to");
//     console.log(job.data)
//   }
// })
