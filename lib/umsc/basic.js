const querystring = require('querystring');
const request = require('request');
const SIGN = require('./sign.js');
const getSign = SIGN.getSign;

let globalObj = {
  APPKEY: '',
  APPID: '',
  URL: '',
  TAG: '',
  MOBILE: '',
  CONTENT: '',
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

let checkEnv = (NAME) => {
  if (!process.env[NAME]) {
    let obj = { NAME };
    console.log('Error: No', obj[Object.keys(obj)[0]]);
    process.exit(1);
  }
  globalObj[NAME] = process.env[NAME]
}

let getTimestamp = () => {
  let stime = new Date().getTime().toString();
  stime = stime.slice(0, stime.length - 3);
  return stime;
}
function getPostData(data) {
  let m = {
    appid: globalObj.APPID,
    sign: '',
    timestamp: '',
    data: '',
    appkey: globalObj.APPKEY,
    // format: 'json',
    // version: '2.0',
  };
  // let m = _.clone(mObj);
  m.timestamp = getTimestamp();
  m.data = data;
  m.sign = getSign(m);


  console.log('\ngetPostData:')
  console.log(m)

  delete m.appkey;

  return m;
}

///////////////////////////////////////////

checkEnv("APPKEY");
checkEnv("APPID")
checkEnv("URL")
checkEnv("MOBILE")
checkEnv("CONTENT")
checkEnv("TAG")

console.log('globalObj:', globalObj);

function main() {
  console.log('Use request to send it')
  console.log('main()')

  let data = JSON.stringify({
    mobile: globalObj.MOBILE,
    content: globalObj.CONTENT + '【' + globalObj.TAG + '】',
    xid: getIdSignleton().toString()
  });

  console.log('\ndata:')
  console.log(data);

  let form = getPostData(data);
  console.log('\nform:')
  console.log(form);

  let formData = querystring.stringify(form);
  console.log('\nformData:');
  console.log(formData);

  let contentLength = formData.length;
  console.log('\nformData len:', contentLength)

  console.log('\nSend msg out');
  request({
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    uri: globalObj.URL,
    body: formData,
    method: 'POST'
  }, (err, res, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log('\nres:');
      // console.log(res);
      console.log('\nbody:');
      console.log(body);
    }
  });
}
main();
