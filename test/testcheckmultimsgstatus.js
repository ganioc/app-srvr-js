const checkMultiMsgStatus = require('../lib/umsc').checkMultiMsgStatus;

async function main() {
  let result = await checkMultiMsgStatus("13041686656", "6677863189037707264");

  console.log(result)
}
main()