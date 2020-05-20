const axios = require('axios');

// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const instance = axios.create({
  baseURL: 'http://api.umsc.ltd',
  timeout: 5000,
});

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

instance.post('/sms/send', {
  appid: 204298,
  sign: f7448dec2953bbe07969f0417dc1e95c,
  timestamp: 1589968613,
  data:
    { "mobile": "13041686656", "content": "验证码35533，您正在发起面对面注册，感谢您的支持！【本来生活】", "xid": "123467" }
}).then((response) => {
  console.log(response.data);
}).catch((err) => {
  console.log(err);

});
