const Queue = require('bullmq').Queue;
const bullmq = require('../lib/bullmq')
const queue = new Queue(bullmq.DEFAULT_QUEUE_NAME);

const send = require('../lib/bullmq').sendDefaultQueue

setInterval(async () => {
  // queue.add(bullmq.DEFAULT_JOB_NAME, { color: 'blue', data: Math.round(10 * Math.random(0)) });
  send({color:'red'})
}, 1000)

// send({ info: "hello" })

