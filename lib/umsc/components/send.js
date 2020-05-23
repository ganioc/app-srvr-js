const querystring = require('querystring');
const request = require('request');

function send(form, url, callback) {

  let formData = querystring.stringify(form);
  console.log('\nformData:');
  console.log(formData);

  let contentLength = formData.length;
  console.log('\nformData len:', contentLength)

  // console.log('\nSend msg out');
  request({
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    uri: url,
    body: formData,
    method: 'POST'
  }, (err, res, body) => {
    if (err) {
      // console.log(err);
      callback(err);
    } else {
      // console.log('\nres:');
      // console.log(res);
      // console.log('\nbody:');
      // console.log(body);
      callback(null, res, body);
    }
  });
}

module.exports = {
  send
}
