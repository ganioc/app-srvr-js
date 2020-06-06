module.exports = {
  checkMobile: (mobile) => {
    // sometimes you will get 86130xxxxxxxx, 
    let out = mobile;
    if (out.length > 11) {
      out = out.slice(out.length - 11)
    }
    return out;
  }
}