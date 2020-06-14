const md5hex = require('md5-hex');
const util = require('util')
const logger = require('../../logger')

function getPassMD5(str) {
  return md5hex(str);
}

// get sign of the map object
function getSign(mmap) {
  logger.debug('getSign()')
  if (mmap === {} || Object.keys(mmap).length < 1) {
    return "";
  }
  let keys = Object.keys(mmap);
  logger.info("keys:");
  logger.debug(util.format('%o', keys));
  keys = keys.sort();
  logger.debug("After sorting, keys:");
  logger.debug(util.format('%o', keys));

  let sb = "";

  logger.debug("Loop the keys:");
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

  logger.debug("The sb is:");
  logger.debug(sb.toString());

  return getPassMD5(sb.toString());
}

// get a different id , everytime;
let getIdSignleton = (function () {
  logger.debug('getIdSingleton')
  let id = Math.floor(0x10000 * Math.random());

  return () => {
    id++;
    if (id > 0x1000000) {
      id = 1;
    }
    logger.debug(id);
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
    logger.error('Error: No');
    logger.error(util.format('%o', obj[Object.keys(obj)[0]]))
    process.exit(1);
  }
  gObj[NAME] = process.env[NAME]
}

let genData = (obj, name, data) => {
  let m = {
    appid: obj.APPID,
    sign: '',
    timestamp: '',
    // data: '',
    appkey: obj.APPKEY,
  };
  m.timestamp = getTimestamp();
  // m.data = data;
  if (name !== '') {
    m[name] = data;
  }

  m.sign = getSign(m);

  logger.debug('genData, return an object for sending:')
  logger.debug(util.format('%o', m))

  delete m.appkey;

  return m;
}

let genDoubleData = (obj, name, data, name2, data2) => {
  let m = {
    appid: obj.APPID,
    sign: '',
    timestamp: '',
    // data: '',
    appkey: obj.APPKEY,
  };
  m.timestamp = getTimestamp();
  // m.data = data;
  if (name !== '') {
    m[name] = data;
  }
  if (name2 !== '') {
    m[name2] = data2
  }

  m.sign = getSign(m);

  logger.debug('genDoubleData, return an object for sending:')
  logger.debug(util.format('%o', m))

  delete m.appkey;

  return m;
}

module.exports = {
  getSign: getSign,
  getId: getIdSignleton,
  getTimestamp: getTimestamp,
  checkEnv: checkEnv,
  genData: genData,
  genDoubleData: genDoubleData
}
