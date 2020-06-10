const mq = require('../lib/bullmq')

async function main() {
  let result = await mq.sendSingleMsg({ name: 'weiwei' })

  console.log(result.id)
}

main()
