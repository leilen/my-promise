const { MyPromise } = require('../dist/my_promise.js');

const countPromiseError = new Error('Promise Error has occured ');

const originCountPromise = (p1 = 1) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 10);
});
const originCountSlowPromise = (p1 = 3) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 400);
});

const originCountErrorPromise = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(countPromiseError);
  }, 100);
});

const countPromise = (p1 = 1) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 10);
});
const countSlowPromise = (p1 = 3) => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    if (p1 === 6) {
      reject(new Error(`Promise Error has occured - value: ${p1}`));
      return;
    }
    console.log(`---Count Promise: ${p1}/5`);
    resolve(p1 + 1);
  }, 400);
});

const countErrorPromise = () => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(countPromiseError);
  }, 1000);
});

const test = (resolve, reject) => {
  setTimeout(() => {
    console.log('tf');
    resolve(1111);
  }, 1000);
};
const testReject = (resolve, reject) => {
  setTimeout(() => {
    reject(new Error('test Error'));
  }, 1000);
};
const main = () => {
  MyPromise.allSync([test, test, testReject, test]).then((resultArr) => {
    console.log('r', resultArr);
  }).catch((e) => {
    console.log('e', e);
  });
};

main();
