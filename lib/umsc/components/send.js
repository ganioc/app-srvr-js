const querystring = require('querystring');
const request = require('request');
const util = require('util')
const logger = require('../../logger')

function send(form, url, callback) {
  logger.debug('send:')
  let formData = querystring.stringify(form);
  logger.debug('formData:');
  logger.debug(util.format('%o', formData));

  let contentLength = formData.length;
  logger.debug('formData len: ' + contentLength)

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
      logger.error(util.format(err))
      callback(err);
    } else {
      callback(null, res, body);
    }
  });
}

module.exports = {
  send
}
