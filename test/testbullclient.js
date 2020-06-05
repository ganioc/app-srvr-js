const Queue = require('bullmq').Queue;

// const queue = new Queue('Paint');

const send = require('../lib/bullmq').sendDefaultQueue

// setInterval(() => {
//   queue.add('cars', { color: 'blue' });
// }, 1000)

setInterval(() => {
  send({ info: "hello-go" })
}, 100)


