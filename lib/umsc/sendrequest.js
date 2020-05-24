const querystring = require('querystring');
const request = require('request');

console.log('Use request to send it')

let form = {
  appid: '204298',
  sign: '03ec89ccae9a07ccfd71f905220f7078',
  timestamp: '1589969234',
  data:
    '{"mobile":"13041686656","content":"验证码35500，您正在发起面对面注册，感谢您的支持！【本来生活】","xid":"123468"}'
};

let formData = querystring.stringify(form);
console.log('\nformData:');
console.log(formData);

let contentLength = formData.length;

request({
  headers: {
    'Content-Length': contentLength,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  uri: 'http://api.umsc.ltd/sms/send',
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


