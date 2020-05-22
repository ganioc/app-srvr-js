const md5hex = require('md5-hex');

function getPassMD5(str) {
  return md5hex(str);
}

// get sign of the map object
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

// get a different id , everytime;
let getIdSignleton = (function () {
  let id = Math.floor(0x10000 * Math.random());

  return () => {
    id++;
    if (id > 0x1000000) {
      id = 1;
    }
    console.log('getIdSingleton', id);
    return id;
  }
})();

let getTimestamp = () => {
  let stime = new Date().getTime().toString();
  stime = stime.slice(0, stime.length - 3);
  return stime;
}
let checkEnv = (gObj, NAME) => {
  if (!process.env[NAME]) {
    let obj = { NAME };
    console.log('Error: No', obj[Object.keys(obj)[0]]);
    process.exit(1);
  }
  gObj[NAME] = process.env[NAME]
}

let genData = (obj, data) => {
  let m = {
    appid: obj.APPID,
    sign: '',
    timestamp: '',
    data: '',
    appkey: obj.APPKEY,
  };
  m.timestamp = getTimestamp();
  m.data = data;
  m.sign = getSign(m);

  console.log('\ngenData, return an object for sending:')
  console.log(m)

  delete m.appkey;

  return m;
}

module.exports = {
  getSign: getSign,
  getId: getIdSignleton,
  getTimestamp: getTimestamp,
  checkEnv: checkEnv,
  genData: genData,
}
