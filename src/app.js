import MyPromise from './my_promise.js';

const originPromiseTest = (p1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(`error ${p1}`);
    console.log('current', p1);
    resolve(p1 + 1);
  }, 1000);
});

const myPromiseTest = (p1) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 30) {
      reject(`error ${p1}`);
      return;
    }
    console.log('current', p1);
    resolve(p1 + 1);
  }, 2000);
});
const myPromiseTest2 = (p1) => new MyPromise((resolve, reject) => {
  // reject('test error');
  setTimeout(() => {
    // reject('e');
    console.log(new Date());
    console.log('body2', p1);
    resolve('test2');
    // reject('e');
  }, 2000);
});

const main = () => {
  myPromiseTest(1).then(myPromiseTest).then(myPromiseTest).then(myPromiseTest)
    .catch((e) => {
      console.log('e', e);
    })
    .finally(() => {
      console.log('finished');
    });
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
