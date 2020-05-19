const SIGN = require('../sign.js');
const getSign = SIGN.getSign;

console.log('sign:');

let APPKEY = "abcde";
let APPID = "123456";

if (process.env.APPKEY) {
  APPKEY = process.env.APPKEY;
}

let map = {
  name: "John",
  region: "小明",
  age: "18",
  weapon: "sword",
  life: "101",
  appkey: APPKEY
};

function main() {
  console.log(map);
  console.log(Object.keys(map));

  let sign = getSign(map);
  console.log("\nResult:");
  console.log(sign);
}

main();