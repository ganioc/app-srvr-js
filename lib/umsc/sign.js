
const md5hex = require('md5-hex');

console.log('sign:');

let map = {
  name: "John",
  region: "小明",
  age: "18",
  weapon: "sword",
  life: "101",
  appkey: "abcde"
};

function getPassMD5(str) {
  return md5hex(str);
}

function getSign(mmap) {
  if (mmap === {} || Object.keys(mmap).length < 1) {
    return "";
  }
  let keys = Object.keys(mmap);
  console.log("keys:");
  console.log(keys);
  keys = keys.sort();
  console.log("After sorting, keys:");
  console.log(keys);

  let sb = "";

  console.log("\nLoop the keys:");
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    if (key.toLowerCase() === "sign" || key.toLowerCase() === "appkey") {
      continue;
    }

    if (mmap[key] !== null && Array.isArray(mmap[key]) === true) {
      let values = mmap[key];
      for (let value of values) {
        if (value !== null && value !== "") {
          sb += key + value.toString();
        }
      }
    } else {
      if (mmap[key] !== null && mmap[key].toString().length > 0) {
        sb += key + mmap[key].toString();
      }
    }
  }
  if (Array.isArray(mmap["appkey"]) === true) {
    sb += mmap["appkey"][0];
  } else {
    sb += mmap["appkey"];
  }

  console.log("\nThe sb is:");
  console.log(sb.toString());

  return getPassMD5(sb.toString());
}

function main() {
  console.log(map);
  console.log(Object.keys(map));

  let sign = getSign(map);
  console.log("\nResult:");
  console.log(sign);
}

main();
