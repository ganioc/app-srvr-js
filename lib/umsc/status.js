const SIGN = require('./components/sign.js');
const send = require('./components/send').send;

let globalObj = {
  APPKEY: '',
  APPID: '',
  URL: '',
  SIZE: '',
}

SIGN.checkEnv(globalObj, "APPKEY");
SIGN.checkEnv(globalObj, "APPID")
SIGN.checkEnv(globalObj, "URL")
SIGN.checkEnv(globalObj, "SIZE")

console.log('globalObj:', globalObj);

function main() {
  let size = globalObj.SIZE

  console.log('\nsize:')
  console.log(size);

  let form = SIGN.genData(globalObj, 'size', size);
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


