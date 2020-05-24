const SIGN = require('./components/sign.js');
const send = require('./components/send').send;

let globalObj = {
  APPKEY: '',
  APPID: '',
  URL: '',
  SMSID: '',
}

SIGN.checkEnv(globalObj, "APPKEY");
SIGN.checkEnv(globalObj, "APPID")
SIGN.checkEnv(globalObj, "URL")
SIGN.checkEnv(globalObj, "SMSID")

console.log('globalObj:', globalObj);

function main() {
  let smsid = globalObj.SMSID;

  console.log('\nsmsid:')
  console.log(smsid);

  let form = SIGN.genData(globalObj, 'smsid', smsid);
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
main()
