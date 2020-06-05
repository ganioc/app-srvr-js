const Queue = require('bullmq').Queue;

// const queue = new Queue('Paint');

const send = require('../lib/bullmq').sendDefaultQueue

// setInterval(() => {
//   queue.add('cars', { color: 'blue' });
// }, 1000)

setInterval(async () => {
  let result = await send({ info: "hello-go" })
  console.log(result.id)
  // if 返回的id不存在的话
}, 2000)


