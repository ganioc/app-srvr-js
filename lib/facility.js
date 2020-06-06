module.exports = {
  checkMobile: (mobile) => {
    // sometimes you will get 86130xxxxxxxx, 
    let out = mobile;
    if (out.length > 11) {
      out = out.slice(out.length - 11)
    }
    return out;
  },
  checkMobiles: (mobileArr) => {
    let outs = []

    for (let i = 0; i < mobileArr.length; i++) {
      let mobile = this.checkMobile(mobileArr[i])
      outs.push(mobile)
    }

    return outs;
  }
}