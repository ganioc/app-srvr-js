const Queue = require('bullmq').Queue;

const defaultQueueName = 'DefaultQueue'
const defaultJobName = 'DefaultJob'

const defaultQueue = new Queue(defaultQueueName)

module.exports = {
  DEFAULT_QUEUE_NAME: defaultQueueName,
  DEFAULT_JOB_NAME: defaultJobName,
  // send a default job out
  sendDefaultQueue: (data) => {
    defaultQueue.add(defaultJobName, data)
  }
}