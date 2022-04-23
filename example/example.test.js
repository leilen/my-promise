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
test('Promise Single Error', (done) => {
  originCountErrorPromise(1).catch((oe) => {
    countErrorPromise(1).catch((e) => {
      expect(oe).toEqual(e);
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

test('MyPromise.resolve(promise)', (done) => {
  Promise.resolve(originCountPromise(1)).then((od) => {
    MyPromise.resolve(countPromise(1)).then((d) => {
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
    MyPromise.all([countPromise(1), countErrorPromise(1), countPromise(1), countPromise(1)]).then((valueArr) => {
      console.log('Value of MyPromise.all Error(This will not be executed)', valueArr);
    }).catch((e) => {
      expect(e).toEqual(oe);
      done();
    });
  });
});

test('MyPromise.allSettled', (done) => {
  const errorSample = new Error('all Error');
  Promise.allSettled([originCountPromise(1), originCountErrorPromise(1), originCountPromise(1), Promise.resolve(1), Promise.reject(errorSample)]).then((oValueArr) => {
    MyPromise.allSettled([countPromise(1), countErrorPromise(1), countPromise(1), MyPromise.resolve(1), MyPromise.reject(errorSample)]).then((valueArr) => {
      expect(valueArr).toEqual(oValueArr);
      done();
    });
  });
});

test('MyPromise.race', (done) => {
  Promise.race([originCountPromise(1), originCountSlowPromise(1), originCountPromise(1)])
    .then((od) => {
      MyPromise.race([countPromise(1), countSlowPromise(1), countPromise(1)])
        .then((d) => {
          expect(od).toEqual(d);
          done();
        });
    });
});

test('MyPromise.race Error', (done) => {
  Promise.race([originCountSlowPromise(1), originCountErrorPromise(1)])
    .catch((oe) => {
      MyPromise.race([countSlowPromise(1), countErrorPromise(1)])
        .catch((e) => {
          expect(oe).toEqual(e);
          done();
        });
    });
});

test('MyPromise.any', (done) => {
  Promise.any([originCountPromise(1), originCountSlowPromise(1), originCountErrorPromise(1), originCountPromise(1)])
    .then((od) => {
      MyPromise.any([countPromise(1), countSlowPromise(1), countErrorPromise(1), countPromise(1)])
        .then((d) => {
          expect(od).toEqual(d);
          done();
        });
    });
});

test('MyPromise.any Error', (done) => {
  Promise.any([originCountErrorPromise(1), originCountErrorPromise(1)])
    .then((oValueArr) => {
    }).catch((oe) => {
      MyPromise.any([countErrorPromise(1), countErrorPromise(1)])
        .then((valueArr) => {
        }).catch((e) => {
          expect(oe.constructor).toEqual(e.constructor);
          done();
        });
    });
});
