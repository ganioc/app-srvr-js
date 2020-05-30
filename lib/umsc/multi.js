const SIGN = require('./components/sign.js');
const send = require('./components/send').send;


let globalObj = {
  APPKEY: '',
  APPID: '',
  URL: '',
  TAG: '',
  MOBILE: '',
  CONTENT: '',
}

SIGN.checkEnv(globalObj, "APPKEY");
SIGN.checkEnv(globalObj, "APPID")
SIGN.checkEnv(globalObj, "URL")
SIGN.checkEnv(globalObj, "MOBILE")
SIGN.checkEnv(globalObj, "CONTENT")
SIGN.checkEnv(globalObj, "TAG")

console.log('globalObj:', globalObj);


function main() {
  let data = JSON.stringify({
    mobile: globalObj.MOBILE,
    content: globalObj.CONTENT + '【' + globalObj.TAG + '】',
    xid: SIGN.getId().toString()
  });

  console.log('\ndata:')
  console.log(data);

  let form = SIGN.genData(globalObj, 'data', data);
  console.log('\nform:')
  console.log(form);

  send(form, globalObj.URL, (err, resp, body) => {
    if (err) {
      console.log("send fail!");
      console.log(err);
    } else {
      console.log("send succeed")
      console.log(body);
    }
  })

}


main();