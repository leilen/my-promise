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
  }, 100);
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
  }, 100);
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
  }, 100);
});

test('Promise Single', (done) => {
  originCountPromise().then((od) => {
    countPromise()
      .then((d) => {
        expect(od).toEqual(d);
        done();
      });
  });
});
test('Promise chain', (done) => {
  originCountPromise().then(originCountPromise).then(originCountPromise).then(originCountPromise)
    .then((od) => {
      countPromise().then(countPromise).then(countPromise).then(countPromise)
        .then((d) => {
          expect(od).toEqual(d);
          done();
        });
    });
});

test('Promise chain error', (done) => {
  originCountPromise().then(originCountPromise).then(originCountPromise)
    .then(originCountPromise)
    .then(originCountPromise)
    .then(originCountPromise)
    .then(originCountPromise)
    .then(originCountPromise)
    .then(originCountPromise)
    .catch((oe) => {
      countPromise().then(countPromise).then(countPromise)
        .then(countPromise)
        .then(countPromise)
        .then(countPromise)
        .then(countPromise)
        .then(countPromise)
        .then(countPromise)
        .catch((e) => {
          expect(oe).toEqual(e);
          done();
        })
        .finally(() => {
          console.log('Complete Error Promise Example...');
        });
    });
});

test('MyPromise.resolve(value)', (done) => {
  const reason = 'reason';
  Promise.resolve(reason).then((od) => {
    MyPromise.resolve(reason).then((d) => {
      expect(od).toEqual(d);
      done();
    });
  });
});

test('MyPromise.reject(value)', (done) => {
  const errorSample = new Error('reject value');
  Promise.reject(errorSample).then((od) => {
  }).catch((oe) => {
    MyPromise.reject(errorSample).then((od) => {
    }).catch((e) => {
      expect(oe).toEqual(e);
      done();
    });
  });
});

test('MyPromise.all', (done) => {
  Promise.all([originCountPromise(1), originCountPromise(1), originCountPromise(1), originCountPromise(1), Promise.resolve(100)])
    .then((oValueArr) => {
      MyPromise.all([countPromise(1), countPromise(1), countPromise(1), countPromise(1), MyPromise.resolve(100)])
        .then((valueArr) => {
          expect(valueArr).toEqual(oValueArr);
          done();
        });
    });
});

test('MyPromise.all Error', (done) => {
  Promise.all([originCountPromise(1), originCountErrorPromise(1), originCountPromise(1), originCountPromise(1)]).then((oValueArr) => {
    console.log('Value of MyPromise.all Error(This will not be executed)', oValueArr);
  }).catch((oe) => {
    console.log(1111,oe)
    MyPromise.all([countPromise(1), countErrorPromise(1), countPromise(1), countPromise(1)]).then((valueArr) => {
      console.log('Value of MyPromise.all Error(This will not be executed)', valueArr);
    }).catch((e) => {
      console.log(2222,e)
      expect(e).toEqual(oe);
      done();
    });
  });
});

// test('MyPromise.allSettled', (done) => {
// const errorSample = new Error('all Error');
// const { resolve, reject } = MyPromise.stateDic;
// MyPromise.allSettled([countPromise, countErrorPromise, countPromise, MyPromise.resolve(1), MyPromise.reject(errorSample)]).then((valueArr) => {
// console.log('Value of MyPromise.allSettled: ', valueArr);
// expect(valueArr).toEqual([resolve, reject, resolve, resolve, reject]);
// done();
// }).finally(() => {
// console.log('Complete MyPromise.allSettled Example...');
// });
// });
// test('MyPromise.race', (done) => {
// MyPromise.race([countPromise, countSlowPromise, countPromise])
// .then((value) => {
// console.log('Value of MyPromise.race: ', value);
// expect(value).toEqual(2);
// done();
// }).catch((e) => {
// console.log('MyPromise.race Error', e);
// }).finally(() => {
// console.log('Complete MyPromise.race Example...');
// });
// });
// test('MyPromise.any Example...', (done) => {
// MyPromise.any([countPromise, countSlowPromise, countErrorPromise, countPromise])
// .then((value) => {
// console.log('Value of MyPromise.any: ', value);
// expect(value).toEqual(2);
// done();
// }).catch((e) => {
// console.log('MyPromise.any Error', e);
// }).finally(() => {
// console.log('Complete MyPromise.any Example...');
// });
// });
// test('MyPromise.any Error Example...', (done) => {
// const iterable = [countErrorPromise, countErrorPromise];
// MyPromise.any(iterable)
// .then((valueArr) => {
// console.log('Value of MyPromise.any Error (This function will not be executed) : ', valueArr);
// }).catch((e) => {
// console.log('MyPromise.any Error Error', e);
// expect(e).toEqual(new AggregateError(iterable, 'No Promise in Promise.any was resolved'));
// done();
// }).finally(() => {
// console.log('Complete MyPromise.any Error Example...');
// });
// });
