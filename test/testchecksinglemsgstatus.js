const checkSingleMsgStatus = require('../lib/umsc').checkSingleMsgStatus;

async function main() {
  let result = await checkSingleMsgStatus("6676420404459859968");

  console.log(result)
}
main()