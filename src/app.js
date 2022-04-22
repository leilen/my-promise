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
    if (p1 === 100) {
      reject(`error ${p1}`);
      return;
    }
    console.log('current', p1);
    resolve(p1 + 1);
  }, 2000);
});

const main = () => {
  MyPromise.all([myPromiseTest2, myPromiseTest, 3]).then((dataArr) => {
    console.log('da', dataArr);
  }).catch((e) => {
    console.log('eeeee', e);
  });
};

main();
