const Queue = require('bullmq').Queue;

const defaultQueueName = 'DefaultQueue'
const defaultJobName = 'DefaultJob'
const singleMsgJobName = 'singleMsg'
const multiMsgJobName = 'multiMsg'

const defaultQueue = new Queue(defaultQueueName)

module.exports = {
  SEND_DELAY: 2000,
  DEFAULT_QUEUE_NAME: defaultQueueName,
  DEFAULT_JOB_NAME: defaultJobName,
  SINGLE_MSG_JOB: singleMsgJobName,
  MULTI_MSG_JOB: multiMsgJobName,
  // send a default job out
  sendDefaultQueue: async (data) => {
    return defaultQueue.add(defaultJobName, data)
  },
  /** data:
   * username
   * mobiles  // [mobile] 只有一个电话号码
   * content  // 短信内容
   * data { 发送回来的数据原样 } object
   */
  sendSingleMsg: async (data) => {
    return defaultQueue.add(this.SINGLE_MSG_JOB, data)
  },
  sendMultiMsg: async (data) => {
    return defaultQueue.add(this.MULTI_MSG_JOB, data)
  }
}