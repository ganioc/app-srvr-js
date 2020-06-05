const Queue = require('bullmq').Queue;

const queue = new Queue('Paint');

setInterval(() => {
  queue.add('cars', { color: 'blue' });
}, 1000)

