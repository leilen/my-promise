import MyPromise from './my_promise.js';

const originPromiseTest = (p1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('current', p1);
    resolve(p1 + 1);
  }, 1000);
});

const myPromiseTest = (p1 = 0) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 110) {
      reject(`error ${p1}`);
      return;
    }
    console.log('current', p1);
    resolve(p1 + 1);
  }, 2000);
});
const myPromiseTest2 = (p1 = 10) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 10) {
      reject(`error ${p1}`);
      return;
    }
    console.log('current', p1);
    resolve(p1 + 1);
  }, 2000);
});

const main = () => {
  // Promise.all(1).then((d) => {
  // console.log(d);
  // });
  //
  MyPromise.all([myPromiseTest2, myPromiseTest, 3]).then((dataArr) => {
    console.log('da', dataArr);
  }).catch((e) => {
    console.log('eeeee', e);
  });
  // MyPromise.all([1, 2, 3]).then((dataArr) => {
  // console.log('da', dataArr);
  // });
  // Promise.all([1, () => 222, 3]).then((dataArr) => {
  // console.log('da', dataArr);
  // });

  // myPromiseTest(1).then(() => MyPromise.resolve('asd')).then((v) => {
  // console.log(v);
  // });
  // originPromiseTest(1).then(() => Promise.resolve('asd')).then((v) => {
  // console.log(v);
  // });
  //
  // MyPromise.resolve(myPromiseTest(1)).then((d) => {
  // console.log(d);
  // });
  // MyPromise.resolve(myPromiseTest(1)).then((d) => {
  // console.log(d);
  // }, () => {
  // console.log('e');
  // });
  //
  //
  // MyPromise.reject(new Error('fail')).then(() => {
  // console.log('resolve');
  // }, (e) => {
  // console.log('e,', e);
  // });

  // myPromiseTest(1).then(myPromiseTest).then(myPromiseTest).then(myPromiseTest)
  // .catch((e) => {
  // console.log('e', e);
  // })
  // .finally(() => {
  // console.log('finished');
  // });
  // originPromiseTest(1)
  // .then(originPromiseTest)
  // .then(originPromiseTest)
  // .then(originPromiseTest)
  // .catch((e) => {
  // console.log(111111, e);
  // });

  // myPromiseTest().then((data) => {
  // console.log('then', data);
  // }).catch((e) => {
  // console.log('catch', e);
  // }).finally(() => {
  // console.log('finally');
  // });
};

main();
