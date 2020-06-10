const bullmq = require('../lib/bullmq')

async function main() {
  let result = await bullmq.sendDefaultQueue({ name: 'hello' })
  
  if(result.id){
    console.log('send succeed')
  }
}

main()

