const { MyPromise } = require('../dist/my_promise.js');

const originPromiseTest = (p1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('current', p1);
    resolve(p1 + 1);
  }, 1000);
});
const originPromiseSlowTest = (p1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('current', p1);
    resolve(p1 + 1);
  }, 5000);
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
    if (p1 === 100) {
      reject(`error ${p1}`);
      return;
    }
    console.log('current', p1);
    resolve(p1 + 1);
  }, 2000);
});

const main = () => {
  MyPromise.any([myPromiseTest, myPromiseTest])
    .then((value) => {
      console.log('Value of MyPromise.race: ', value);
    }).catch((e) => {
      console.log('MyPromise.race Error', e);
    }).finally(() => {
      console.log('Complete MyPromise.race Example...');
    });
};

main();
