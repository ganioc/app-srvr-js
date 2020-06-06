

let p = () => {
  return new Promise((resolve) => {
    console.log('level 1')
    setTimeout(() => {
      resolve(18)
    }, 1000)
  }).then((data) => {
    console.log('level 2')
    console.log(data);
    return data * 2;
  }).then((data) => {
    console.log('level 3')
    console.log(data)
  })
}
let p2 = () => {
  console.log('\np2()')
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(1)
      resolve(2);
    }, 1000);
  }).then((data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('level 2')


        console.log('after resolve to reject')
        reject(data * 2)
        resolve(100);
      }, 1000)
    })
  }).then((data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('level 3')
        console.log('data:', data)
        resolve(data * 3);
      })
    })
  }).catch((e) => {
    console.log('error:')
    console.log(e);
  })
}

(async () => {
  await p()
  await p2()
})()