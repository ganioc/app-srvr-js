const checkSingleMsgStatus = require('../lib/umsc').checkSingleMsgStatus;

async function main() {
  let result = await checkSingleMsgStatus("6676478043982131200");

  console.log(result)
}
main()