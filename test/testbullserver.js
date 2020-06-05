const Worker = require('bullmq').Worker;

const worker = new Worker('Paint', async job => {
  if (job.name === 'cars') {
    console.log("paint the car to");
    console.log(job.data)
  }
})