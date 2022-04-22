import {MyPromise} from './my_promise.js';

const originPromiseTest = () =>{
  return new Promise((resolve,reject) =>{
    setTimeout(() =>{
      resolve();
    },1000)
  })
}

const myPromiseTest = () =>{
  return new MyPromise((resolve,reject) =>{
    setTimeout(() =>{
      resolve();
    },1000)
  })
}

const main = () =>{
  //originPromiseTest().then(() =>{
    //console.log('fin')
  //})
  myPromiseTest().then(() =>{
    console.log('fin')
  }).catch( () =>{} )
}

main();

