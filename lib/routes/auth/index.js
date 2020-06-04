const bcrypt = require('bcrypt');
const svgCaptcha = require('svg-captcha')
let UserModel = require('../../model/user.js');
const jwt = require('jsonwebtoken');
const authJWT = require('../jwt')
const logger = require('../../logger')
const util = require('util')

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT || 'keepsafe';
const ErrCode = require('../../err')

let fun = (router) => {
  router.get('/api/auth/info', authJWT, (req, res) => {
    logger.debug('/api/auth/info');
    logger.debug('username:%s role:%s', req.session.username, req.session.role);

    res.json({
      code: 0, data: {
        name: req.session.username,
        role: req.session.role
      }
    })
  });

  router.get('/api/auth/captcha', (req, res) => {
    logger.debug('/api/auth/captcha');
    let captcha = svgCaptcha.create({ noise: 1, ignoreChars: '0o1i', size: 5 });
    req.session.captcha = captcha.text.toLowerCase();
    logger.debug('text: %s', captcha.text);

    res.json({ code: 0, data: { captcha: captcha.data } });
  })

  router.post('/api/auth/login', (req, res) => {
    logger.debug('/api/auth/login:')
    // console.log(req);
    logger.debug(util.format('%o', req.body));

    let captcha_text = req.body.captcha;

    if (req.session.captcha !== captcha_text.toLowerCase()) {
      logger.error('wrong captcha');
      res.json({ code: ErrCode.AUTH_INVALID_CAPTCHA, data: { message: 'FAIL' } });
      return;
    }

    let user = req.body.username;
    let pass = req.body.password;

    UserModel.find({ username: user }, function (error, user) {
      if (error) {
        logger.error('wrong auth');
        logger.error(util.format('%s', error));
        res.json({ code: ErrCode.AUTH_ERROR, data: { message: 'FAIL' } });
      } else {
        logger.info("user:%s", user);
        if (user.length == 0) {
          return res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
        }

        logger.info("pwd:%s", pass);

        bcrypt.compare(pass, user[0].password, function (err, doesMatch) {
          if (err) {
            logger.error('wrong password');
            logger.error(util.format('%o', err));
            res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
          } else if (doesMatch === true) {
            logger.info('password match');
            let user0 = user[0];
            let usertoken = jwt.sign({ username: user0.username, role: user0.role }, SECRET_KEY_JWT, { expiresIn: '1h' }
            );
            let resObj = {
              code: 0,
              data: {
                // I will have name in the interface
                // username in the database. Be careful!!
                username: user0.username,
                email: user0.email,
                role: user0.role,
                token: usertoken
              }
            };
            logger.debug(util.format('%o', resObj));
            req.session.username = user0.username;
            req.session.role = user0.role;
            req.session.token = usertoken;

            return res.json(resObj);
          } else {
            logger.info('password not match');
            res.json({ code: ErrCode.AUTH_FAIL, data: { message: 'FAIL' } });
          }
        });
      }
    });
  });


  router.post('/api/auth/logout', (req, res) => {
    logger.debug('/api/auth/logout:')
    req.session.destroy();
    res.json({
      code: 0,
      data: {}
    });
  });
}

module.exports = fun;