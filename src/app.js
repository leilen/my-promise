import MyPromise from './my_promise.js';

const originPromiseTest = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

const myPromiseTest = () => new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

const main = () => {
  // originPromiseTest().then(() =>{
  // console.log('fin')
  // })
  myPromiseTest().then(() => {
    console.log('fin');
  }).catch(() => {});
};

main();
