import MyPromise from './my_promise.js';

const originPromiseTest = () => new Promise((resolve, reject) => {
  // reject('testError');
  setTimeout(() => {
    // reject('testError');
    console.log(111);
    resolve('test');
    // reject('testError');
  }, 1000);
});

const myPromiseTest = () => new MyPromise((resolve, reject) => {
  reject('test error');
  setTimeout(() => {
    // reject('e');
    resolve('test');
    // reject('e');
  }, 2000);
});

const main = () => {
  myPromiseTest().then((data) => {
    console.log('then', data);
  }).catch((e) => {
    console.log('catch', e);
  }).finally(() => {
    console.log('finally');
  });
};

main();
